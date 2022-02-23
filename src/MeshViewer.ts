import * as THREE from 'three'
import { GUI } from 'dat.gui'
import { GraphicsApp } from './GraphicsApp'

export class MeshViewer extends GraphicsApp
{ 
    // State variables
    private debugMode : boolean;
    private mouseDrag : boolean;

    // Camera parameters
    private cameraOrbitX : number;
    private cameraOrbitY : number;
    private cameraDistance : number;

    // Light parameters
    private lightOrbitX : number;
    private lightOrbitY : number;
    private lightIntensity : number;
    
    // Objects and materials
    private debugMaterial : THREE.MeshBasicMaterial;
    private light : THREE.DirectionalLight;
    private lightHelper : THREE.Line;

    constructor()
    {
        // Pass in the aspect ratio to the constructor
        super(1920/1080);

        this.debugMode = false;
        this.mouseDrag = false;

        this.cameraOrbitX = 0;
        this.cameraOrbitY = 0;
        this.cameraDistance = 0;

        this.lightOrbitX = 0;
        this.lightOrbitY = 0;
        this.lightIntensity = 0;

        this.debugMaterial = new THREE.MeshBasicMaterial();
        this.light = new THREE.DirectionalLight();
        this.lightHelper = new THREE.Line();
    }

    createScene() : void
    {
        // Setup camera
        this.cameraDistance = 4;
        this.camera.position.set(0, 0, this.cameraDistance);
        this.camera.lookAt(0, 0, 0);
        this.camera.up.set(0, 1, 0);

        // Create an ambient light
        var ambientLight = new THREE.AmbientLight('white', 0.5);
        this.scene.add(ambientLight);

        // Create a directional light
        this.light.color = new THREE.Color('white');
        this.lightIntensity = 1;
        this.lightOrbitX = -22.5;
        this.lightOrbitY = 45;
        this.scene.add(this.light)

        // Create a visual indicator for the light direction
        var lineVertices = [];
        lineVertices.push(new THREE.Vector3(0, 0, 0));
        lineVertices.push(new THREE.Vector3(0, 0, 10));
        this.lightHelper.geometry.setFromPoints(lineVertices);
        this.scene.add(this.lightHelper);

        // Assign the visual indicator color
        var lightHelperMaterial = new THREE.LineBasicMaterial();
        lightHelperMaterial.color = new THREE.Color('gray');
        this.lightHelper.material = lightHelperMaterial;

        // Update all the light visuals
        this.updateLightParameters();

        // Put the debug material into wireframe mode
        this.debugMaterial.wireframe = true;

        // Create a visual representation of the axes
        var axisHelper = new THREE.AxesHelper(2);
        this.scene.add(axisHelper);

        // Create the GUI
        var gui = new GUI();
        var controls = gui.addFolder('Controls');
        controls.open();

        // Create a GUI control for the light parameters
        var lightXController = controls.add(this, 'lightOrbitX', -180, 180);
        lightXController.name('Light Orbit X');
        lightXController.onChange((value: number) => { this.updateLightParameters()});

        var lightYController = controls.add(this, 'lightOrbitY', -90, 90);
        lightYController.name('Light Orbit Y');
        lightYController.onChange((value: number) => { this.updateLightParameters()});

        var lightYController = controls.add(this, 'lightIntensity', 0, 2);
        lightYController.name('Light Intensity');
        lightYController.onChange((value: number) => { this.updateLightParameters()});

        // Create a GUI control for the debug mode and add a change event handler
        var debugController = controls.add(this, 'debugMode');
        debugController.name('Debug Mode');
        debugController.onChange((value: boolean) => { this.toggleDebugMode(value) });

        var steve = this.createSteve();
        this.scene.add(steve);
    }

    private createSteve() : THREE.Mesh
    {
        var steve = new THREE.Mesh();

        var vertices = this.createBoxVertices(1, 1, 1);
        var normals = this.createBoxNormals();
        var uvs = this.createBoxTextureCoords();
        var indices = this.createBoxIndices();

        steve.geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        steve.geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        steve.geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        steve.geometry.setIndex(indices);

        var material = new THREE.MeshLambertMaterial();
        material.map = new THREE.TextureLoader().load('./assets/steve.png');
        steve.material = material;
        
        return steve;
    }

    private createBoxVertices(width: number, height: number, depth: number) : number[]
    {
        var vertices = [];

        // Front face
        vertices.push(-width/2, -height/2, depth/2);
        vertices.push(width/2, -height/2, depth/2);
        vertices.push(width/2, height/2, depth/2);
        vertices.push(-width/2, height/2, depth/2);

        // Back face
        vertices.push(-width/2, -height/2, -depth/2);
        vertices.push(width/2, -height/2, -depth/2);
        vertices.push(width/2, height/2, -depth/2);
        vertices.push(-width/2, height/2, -depth/2);

        // Left face
        vertices.push(-width/2, -height/2, -depth/2);
        vertices.push(-width/2, -height/2, depth/2);
        vertices.push(-width/2, height/2, depth/2);
        vertices.push(-width/2, height/2, -depth/2);

        // Left face
        vertices.push(width/2, -height/2, -depth/2);
        vertices.push(width/2, -height/2, depth/2);
        vertices.push(width/2, height/2, depth/2);
        vertices.push(width/2, height/2, -depth/2);

        // Top face
        vertices.push(-width/2, height/2, depth/2);
        vertices.push(width/2, height/2, depth/2);
        vertices.push(width/2, height/2, -depth/2);
        vertices.push(-width/2, height/2, -depth/2);

        // Bottom face
        vertices.push(-width/2, -height/2, depth/2);
        vertices.push(width/2, -height/2, depth/2);
        vertices.push(width/2, -height/2, -depth/2);
        vertices.push(-width/2, -height/2, -depth/2);
        
        return vertices;
    }

    private createBoxNormals() : number[]
    {
        var normals = [];

        // Front face
        normals.push(0, 0, 1);
        normals.push(0, 0, 1);
        normals.push(0, 0, 1);
        normals.push(0, 0, 1);

        // Back face
        normals.push(0, 0, -1);
        normals.push(0, 0, -1);
        normals.push(0, 0, -1);
        normals.push(0, 0, -1);

        // Left face
        normals.push(-1, 0, 0);
        normals.push(-1, 0, 0);
        normals.push(-1, 0, 0);
        normals.push(-1, 0, 0);

        // Right face
        normals.push(1, 0, 0);
        normals.push(1, 0, 0);
        normals.push(1, 0, 0);
        normals.push(1, 0, 0);

        // Top face
        normals.push(0, 1, 0);
        normals.push(0, 1, 0);
        normals.push(0, 1, 0);
        normals.push(0, 1, 0);

        // Bottom face
        normals.push(0, -1, 0);
        normals.push(0, -1, 0);
        normals.push(0, -1, 0);
        normals.push(0, -1, 0);
       
        return normals;
    }

    private createBoxIndices() : number[]
    {
        var indices = [];

        // Front face
        indices.push(0, 1, 2);
        indices.push(2, 3, 0);

        // Back face
        indices.push(4, 6, 5);
        indices.push(6, 4, 7);

        // Left face
        indices.push(8, 9, 10);
        indices.push(10, 11, 8);

        // Right face
        indices.push(12, 14, 13);
        indices.push(14, 12, 15);

        // Top face
        indices.push(16, 17, 18);
        indices.push(18, 19, 16);

        // Bottom face
        indices.push(20, 22, 21);
        indices.push(22, 20, 23);

        return indices;
    }

    private createBoxTextureCoords() : number[]
    {
        var uvs = [];

        // Front face
        uvs.push(this.rescale(64, 0, 512, 0, 1), this.rescale(64+64, 0, 512, 1, 0));
        uvs.push(this.rescale(64+64, 0, 512, 0, 1), this.rescale(64+64, 0, 512, 1, 0));
        uvs.push(this.rescale(64+64, 0, 512, 0, 1), this.rescale(64, 0, 512, 1, 0));
        uvs.push(this.rescale(64, 0, 512, 0, 1), this.rescale(64, 0, 512, 1, 0));

        // Back face
        uvs.push(this.rescale(64+128, 0, 512, 0, 1), this.rescale(64+64, 0, 512, 1, 0));
        uvs.push(this.rescale(64+64+128, 0, 512, 0, 1), this.rescale(64+64, 0, 512, 1, 0));
        uvs.push(this.rescale(64+64+128, 0, 512, 0, 1), this.rescale(64, 0, 512, 1, 0));
        uvs.push(this.rescale(64+128, 0, 512, 0, 1), this.rescale(64, 0, 512, 1, 0));

        // Left face
        uvs.push(this.rescale(64-64, 0, 512, 0, 1), this.rescale(64+64, 0, 512, 1, 0));
        uvs.push(this.rescale(64+64-64, 0, 512, 0, 1), this.rescale(64+64, 0, 512, 1, 0));
        uvs.push(this.rescale(64+64-64, 0, 512, 0, 1), this.rescale(64, 0, 512, 1, 0));
        uvs.push(this.rescale(64-64, 0, 512, 0, 1), this.rescale(64, 0, 512, 1, 0));

        // Right face
        uvs.push(this.rescale(64+64, 0, 512, 0, 1), this.rescale(64+64, 0, 512, 1, 0));
        uvs.push(this.rescale(64+64+64, 0, 512, 0, 1), this.rescale(64+64, 0, 512, 1, 0));
        uvs.push(this.rescale(64+64+64, 0, 512, 0, 1), this.rescale(64, 0, 512, 1, 0));
        uvs.push(this.rescale(64+64, 0, 512, 0, 1), this.rescale(64, 0, 512, 1, 0));

        // Top face
        uvs.push(this.rescale(64, 0, 512, 0, 1), this.rescale(64+64-64, 0, 512, 1, 0));
        uvs.push(this.rescale(64+64, 0, 512, 0, 1), this.rescale(64+64-64, 0, 512, 1, 0));
        uvs.push(this.rescale(64+64, 0, 512, 0, 1), this.rescale(64-64, 0, 512, 1, 0));
        uvs.push(this.rescale(64, 0, 512, 0, 1), this.rescale(64-64, 0, 512, 1, 0));

        // Bottom face
        uvs.push(this.rescale(64+64, 0, 512, 0, 1), this.rescale(64+64-64, 0, 512, 1, 0));
        uvs.push(this.rescale(64+64+64, 0, 512, 0, 1), this.rescale(64+64-64, 0, 512, 1, 0));
        uvs.push(this.rescale(64+64+64, 0, 512, 0, 1), this.rescale(64-64, 0, 512, 1, 0));
        uvs.push(this.rescale(64+64, 0, 512, 0, 1), this.rescale(64-64, 0, 512, 1, 0));

        return uvs;
    }

    private rescale(x: number, xmin: number, xmax: number, ymin: number, ymax: number) : number
    {
        return ymin + (ymax - ymin) * (x - xmin) / (xmax - xmin)
    }

    update(deltaTime : number) : void
    {

    } 

    // Mouse event handlers for wizard functionality
    onMouseDown(event: MouseEvent) : void 
    {
        if((event.target! as Element).localName == "canvas")
        {
            this.mouseDrag = true;
        }
    }

    // Mouse event handlers for wizard functionality
    onMouseUp(event: MouseEvent) : void
    {
        this.mouseDrag = false;
    }
    
    onMouseMove(event: MouseEvent) : void
    {
        if(this.mouseDrag)
        {
            this.cameraOrbitX += event.movementY;

            if(this.cameraOrbitX < 90 || this.cameraOrbitX > 270)
                this.cameraOrbitY += event.movementX;
            else
                this.cameraOrbitY -= event.movementX;

            if(this.cameraOrbitX >= 360)
                this.cameraOrbitX -= 360;
            else if(this.cameraOrbitX < 0)
                this.cameraOrbitX += 360;

            if(this.cameraOrbitY >= 360)
                this.cameraOrbitY -= 360;
            else if(this.cameraOrbitY < 0)
                this.cameraOrbitY += 360;

            this.updateCameraOrbit();
        }
    }

    private updateCameraOrbit() : void
    {
        var rotationMatrix = new THREE.Matrix4().makeRotationY(-this.cameraOrbitY * Math.PI / 180);
        rotationMatrix.multiply(new THREE.Matrix4().makeRotationX(-this.cameraOrbitX * Math.PI / 180));

        this.camera.position.set(0, 0, this.cameraDistance);
        this.camera.applyMatrix4(rotationMatrix);

        if(this.cameraOrbitX < 90 || this.cameraOrbitX > 270)
            this.camera.up.set(0, 1, 0);
        else if(this.cameraOrbitX > 90 && this.cameraOrbitX < 270)
            this.camera.up.set(0, -1, 0);
        else if(this.cameraOrbitX == 270)
            this.camera.up.set(Math.sin(-this.cameraOrbitY * Math.PI / 180), 0, Math.cos(-this.cameraOrbitY * Math.PI / 180));
        else
            this.camera.up.set(-Math.sin(-this.cameraOrbitY * Math.PI / 180), 0, -Math.cos(-this.cameraOrbitY * Math.PI / 180));

        this.camera.lookAt(0, 0, 0);
    }

    private updateLightParameters() : void
    {
        var rotationMatrix = new THREE.Matrix4().makeRotationY(this.lightOrbitX * Math.PI / 180);
        rotationMatrix.multiply(new THREE.Matrix4().makeRotationX(-this.lightOrbitY * Math.PI / 180));

        this.light.position.set(0, 0, 10);
        this.light.applyMatrix4(rotationMatrix);

        this.lightHelper.lookAt(this.light.position);

        this.light.intensity = this.lightIntensity;
    }

    private toggleDebugMode(debugMode: boolean) : void
    {
        this.scene.traverse((elem: THREE.Object3D) => {
            if(elem instanceof THREE.Mesh)
            {
                if(debugMode)
                {
                    elem.userData = {'originalMaterial' : elem.material}
                    elem.material = this.debugMaterial;
                }
                else
                {
                    elem.material = elem.userData['originalMaterial'];
                }
            }
        });
    }
}
