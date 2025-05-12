let facemesh;
let video;
let predictions = [];

function setup() {
  createCanvas(windowWidth, windowHeight); // 設置畫布為全螢幕
  video = createCapture(VIDEO);
  video.size(windowWidth, windowHeight); // 設定攝影機影像大小
  video.hide();

  facemesh = ml5.facemesh(video, modelReady);
  facemesh.on("predict", (results) => {
    predictions = results;
  });
}

function modelReady() {
  console.log("Facemesh model loaded!");
}

function draw() {
  background(220);
  image(video, 0, 0, width, height);

  if (predictions.length > 0) {
    const keypoints = predictions[0].scaledMesh;

    // 畫嘴唇
    stroke(0, 0, 255); // 藍色線條
    strokeWeight(4); // 線條粗度
    noFill();
    const lips = [
      409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291,
      76, 77, 90, 180, 85, 16, 315, 404, 320, 307, 306, 408, 304, 303, 302, 11, 72, 73, 74, 184,
    ];
    drawLines(keypoints, lips);

    // 畫左眼
    stroke(255, 165, 0); // 橘色線條
    strokeWeight(6); // 線條粗度
    const leftEye = [
      243, 190, 56, 28, 27, 29, 30, 247, 130, 25, 110, 24, 23, 22, 26, 112,
      133, 173, 157, 158, 159, 160, 161, 246, 33, 7, 163, 144, 145, 153, 154, 155,
    ];
    drawLines(keypoints, leftEye);

    // 畫右眼
    stroke(128, 0, 128); // 紫色線條
    strokeWeight(4); // 線條粗度
    const rightEye = [
      359, 467, 260, 259, 257, 258, 286, 414, 463, 341, 256, 252, 253, 254, 339, 255,
      263, 466, 388, 387, 386, 385, 384, 398, 362, 382, 381, 380, 374, 373, 390, 249,
    ];
    drawLines(keypoints, rightEye);
  }
}

function drawLines(keypoints, indices) {
  if (!keypoints || indices.length === 0) return; // 確保有數據
  beginShape();
  for (let i = 0; i < indices.length; i++) {
    const index = indices[i];
    if (keypoints[index]) {
      const [x, y] = keypoints[index];
      // 映射座標到畫布大小
      vertex(x * (width / video.width), y * (height / video.height));
    }
  }
  endShape(CLOSE);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // 當視窗大小改變時，調整畫布大小
  video.size(windowWidth, windowHeight); // 同步調整攝影機影像大小
}