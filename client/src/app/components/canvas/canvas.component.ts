import { Component, OnInit } from "@angular/core";
import * as THREE from "three";
import * as signalR from "@microsoft/signalr";

@Component({
  selector: "app-canvas",
  templateUrl: "./canvas.component.html",
  styleUrls: ["./canvas.component.scss"],
})
export class CanvasComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    this.initSignal();
    this.initThree();
  }

  // TODO: refactor as service
  initSignal() {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5000/stream")
      .build();

    connection.on("messageReceived", (message: string) => {
      console.log("message", message);
    });

    connection.start().catch((error) => console.log("signal error", error));

    connection.send("newMessage", "Testing sending message");
  }

  initThree() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    const rootElement = document.querySelector(".canvas__root");
    rootElement.appendChild(renderer.domElement);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    const animate = function () {
      requestAnimationFrame(animate);

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderer.render(scene, camera);
    };

    animate();
  }
}
