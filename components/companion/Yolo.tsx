"use client";

import ndarray from "ndarray";
import { InferenceSession, Tensor } from "onnxruntime-web";
import ops from "ndarray-ops";
import { round } from "lodash";
import ObjectDetectionCamera from "./ObjectDetectionCamera";
import { yoloClasses } from "@/lib/companion/yolo_classes";
import { runModelUtils } from "@/lib/companion";
import { useState, useEffect } from "react";

type PostprocessFunction = (
  ctx: CanvasRenderingContext2D,
  modelResolution: number[],
  tensor: Tensor,
  conf2color: (conf: number) => string
) => number[];

/** Model path: served from public/companion/models/ */
const COMPANION_MODEL_BASE = "/companion/models";

const RES_TO_MODEL: [number[], string][] = [
  [[256, 256], "yolov10n.onnx"],
  [[256, 256], "yolo12n.onnx"],
  [[256, 256], "yolo11n.onnx"],
  [[256, 256], "yolov7-tiny_256x256.onnx"],
  [[320, 320], "yolov7-tiny_320x320.onnx"],
  [[640, 640], "yolov7-tiny_640x640.onnx"],
];

const Yolo = (props: {
  width?: number;
  height?: number;
  onDetections?: (classIds: number[]) => void;
}) => {
  const [modelResolution, setModelResolution] = useState<number[]>(
    RES_TO_MODEL[0][0]
  );
  const [modelName, setModelName] = useState<string>(RES_TO_MODEL[0][1]);
  const [session, setSession] = useState<InferenceSession | null>(null);

  useEffect(() => {
    const getSession = async () => {
      try {
        const s = await runModelUtils.createModelCpu(
          `${COMPANION_MODEL_BASE}/${modelName}`
        );
        setSession(s);
      } catch (e) {
        console.warn("[Companion] Model load failed", modelName, e);
        setSession(null);
      }
    };
    getSession();
  }, [modelName, modelResolution]);

  const changeModelResolution = (width?: number, height?: number) => {
    if (width !== undefined && height !== undefined) {
      setModelResolution([width, height]);
      return;
    }
    const index = RES_TO_MODEL.findIndex((item) => item[0] === modelResolution);
    if (index === RES_TO_MODEL.length - 1) {
      setModelResolution(RES_TO_MODEL[0][0]);
      setModelName(RES_TO_MODEL[0][1]);
    } else {
      setModelResolution(RES_TO_MODEL[index + 1][0]);
      setModelName(RES_TO_MODEL[index + 1][1]);
    }
  };

  const resizeCanvasCtx = (
    ctx: CanvasRenderingContext2D,
    targetWidth: number,
    targetHeight: number,
    inPlace = false
  ) => {
    let canvas: HTMLCanvasElement;

    if (inPlace) {
      canvas = ctx.canvas;
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      ctx.scale(
        targetWidth / canvas.clientWidth,
        targetHeight / canvas.clientHeight
      );
    } else {
      canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      canvas
        .getContext("2d")!
        .drawImage(ctx.canvas, 0, 0, targetWidth, targetHeight);
      ctx = canvas.getContext("2d")!;
    }

    return ctx;
  };

  const preprocess = (ctx: CanvasRenderingContext2D) => {
    const resizedCtx = resizeCanvasCtx(
      ctx,
      modelResolution[0],
      modelResolution[1]
    );

    const imageData = resizedCtx.getImageData(
      0,
      0,
      modelResolution[0],
      modelResolution[1]
    );
    const { data, width, height } = imageData;
    const dataTensor = ndarray(new Float32Array(data), [width, height, 4]);
    const dataProcessedTensor = ndarray(new Float32Array(width * height * 3), [
      1,
      3,
      width,
      height,
    ]);

    ops.assign(
      dataProcessedTensor.pick(0, 0, null, null),
      dataTensor.pick(null, null, 0)
    );
    ops.assign(
      dataProcessedTensor.pick(0, 1, null, null),
      dataTensor.pick(null, null, 1)
    );
    ops.assign(
      dataProcessedTensor.pick(0, 2, null, null),
      dataTensor.pick(null, null, 2)
    );

    ops.divseq(dataProcessedTensor, 255);

    const tensor = new Tensor("float32", new Float32Array(width * height * 3), [
      1,
      3,
      width,
      height,
    ]);

    (tensor.data as Float32Array).set(dataProcessedTensor.data as Float32Array);
    return tensor;
  };

  const conf2color = (conf: number) => {
    const r = Math.round(255 * (1 - conf));
    const g = Math.round(255 * conf);
    return `rgb(${r},${g},0)`;
  };

  const postprocessMap: Record<string, PostprocessFunction> = {
    "yolo12n.onnx": postprocessYolov11,
    "yolo11n.onnx": postprocessYolov11,
    "yolov10n.onnx": postprocessYolov10,
    "yolov7-tiny_256x256.onnx": postprocessYolov7,
    "yolov7-tiny_320x320.onnx": postprocessYolov7,
    "yolov7-tiny_640x640.onnx": postprocessYolov7,
  };

  const postprocess = (
    tensor: Tensor,
    _inferenceTime: number,
    ctx: CanvasRenderingContext2D,
    modelName: string
  ): number[] => {
    if (modelName in postprocessMap) {
      const classIds = postprocessMap[modelName](
        ctx,
        modelResolution,
        tensor,
        conf2color
      );
      if (classIds.length > 0) {
        console.debug("[Companion Yolo] postprocess returned classIds", {
          modelName,
          classIds,
          count: classIds.length,
        });
      }
      props.onDetections?.(classIds);
      return classIds;
    }
    console.debug("[Companion Yolo] postprocess: modelName not in map", {
      modelName,
      keys: Object.keys(postprocessMap),
    });
    return [];
  };

  if (session == null) {
    return (
      <div className="p-5 text-center">
        Loading model {modelName}…
      </div>
    );
  }

  return (
    <ObjectDetectionCamera
      width={props.width ?? 640}
      height={props.height ?? 480}
      preprocess={preprocess}
      postprocess={postprocess}
      session={session}
      changeCurrentModelResolution={changeModelResolution}
      currentModelResolution={modelResolution}
      modelName={modelName}
      onDetections={props.onDetections}
    />
  );
};

export default Yolo;

function applyNMS(
  detections: Array<{
    x0: number;
    y0: number;
    x1: number;
    y1: number;
    confidence: number;
    classId: number;
  }>,
  iouThreshold: number
) {
  detections.sort((a, b) => b.confidence - a.confidence);
  const keep: boolean[] = new Array(detections.length).fill(true);

  for (let i = 0; i < detections.length; i++) {
    if (!keep[i]) continue;
    const boxA = detections[i];
    for (let j = i + 1; j < detections.length; j++) {
      if (!keep[j]) continue;
      const boxB = detections[j];
      if (boxA.classId !== boxB.classId) continue;
      const iou = calculateIoU(boxA, boxB);
      if (iou > iouThreshold) keep[j] = false;
    }
  }
  return detections.filter((_, index) => keep[index]);
}

function calculateIoU(
  boxA: { x0: number; y0: number; x1: number; y1: number },
  boxB: { x0: number; y0: number; x1: number; y1: number }
) {
  const x0 = Math.max(boxA.x0, boxB.x0);
  const y0 = Math.max(boxA.y0, boxB.y0);
  const x1 = Math.min(boxA.x1, boxB.x1);
  const y1 = Math.min(boxA.y1, boxB.y1);
  const intersectionArea = Math.max(0, x1 - x0) * Math.max(0, y1 - y0);
  const boxAArea = (boxA.x1 - boxA.x0) * (boxA.y1 - boxA.y0);
  const boxBArea = (boxB.x1 - boxB.x0) * (boxB.y1 - boxB.y0);
  const unionArea = boxAArea + boxBArea - intersectionArea;
  return intersectionArea / unionArea;
}

const postprocessYolov11: PostprocessFunction = (
  ctx: CanvasRenderingContext2D,
  modelResolution: number[],
  tensor: Tensor,
  conf2color: (conf: number) => string
) => {
  const dx = ctx.canvas.width / modelResolution[0];
  const dy = ctx.canvas.height / modelResolution[1];

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const numClasses = 80;
  const numAnchors = tensor.dims[2];
  const confidenceThreshold = 0.25;

  const detections: Array<{
    x0: number;
    y0: number;
    x1: number;
    y1: number;
    confidence: number;
    classId: number;
  }> = [];

  for (let i = 0; i < numAnchors; i++) {
    const x_center = (tensor.data as Float32Array)[i];
    const y_center = (tensor.data as Float32Array)[numAnchors + i];
    const width = (tensor.data as Float32Array)[2 * numAnchors + i];
    const height = (tensor.data as Float32Array)[3 * numAnchors + i];

    let maxClassScore = 0;
    let maxClassId = 0;

    for (let j = 0; j < numClasses; j++) {
      const classScore = (tensor.data as Float32Array)[
        (4 + j) * numAnchors + i
      ];
      if (classScore > maxClassScore) {
        maxClassScore = classScore;
        maxClassId = j;
      }
    }

    if (maxClassScore > confidenceThreshold) {
      const x0 = x_center - width / 2;
      const y0 = y_center - height / 2;
      const x1 = x_center + width / 2;
      const y1 = y_center + height / 2;
      detections.push({
        x0,
        y0,
        x1,
        y1,
        confidence: maxClassScore,
        classId: maxClassId,
      });
    }
  }

  const nmsDetections = applyNMS(detections, 0.4);
  const classIds = [...new Set(nmsDetections.map((d) => d.classId))];

  for (const detection of nmsDetections) {
    const x0 = detection.x0 * dx;
    const y0 = detection.y0 * dy;
    const x1 = detection.x1 * dx;
    const y1 = detection.y1 * dy;
    const score = round(detection.confidence * 100, 1);
    const label =
      yoloClasses[detection.classId].toString()[0].toUpperCase() +
      yoloClasses[detection.classId].toString().substring(1) +
      " " +
      score.toString() +
      "%";
    const color = conf2color(detection.confidence);

    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
    ctx.font = "20px Arial";
    ctx.fillStyle = color;
    ctx.fillText(label, x0, y0 - 5);
    ctx.fillStyle = color.replace(")", ", 0.2)").replace("rgb", "rgba");
    ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
  }
  return classIds;
};

function postprocessYolov10(
  ctx: CanvasRenderingContext2D,
  modelResolution: number[],
  tensor: Tensor,
  conf2color: (conf: number) => string
): number[] {
  const dx = ctx.canvas.width / modelResolution[0];
  const dy = ctx.canvas.height / modelResolution[1];

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const classIds: number[] = [];
  let x0: number, y0: number, x1: number, y1: number, cls_id: number, score: number;
  for (let i = 0; i < tensor.dims[1]; i += 6) {
    [x0, y0, x1, y1, score, cls_id] = Array.from(
      (tensor.data as Float32Array).slice(i, i + 6)
    ) as number[];
    if (score < 0.25) break;

    classIds.push(cls_id);
    [x0, x1] = [x0, x1].map((x: number) => x * dx);
    [y0, y1] = [y0, y1].map((x: number) => x * dy);
    [x0, y0, x1, y1, cls_id] = [x0, y0, x1, y1, cls_id].map((x: number) =>
      round(x)
    );
    [score] = [round(score * 100, 1)];
    const label =
      yoloClasses[cls_id].toString()[0].toUpperCase() +
      yoloClasses[cls_id].toString().substring(1) +
      " " +
      score.toString() +
      "%";
    const color = conf2color(score / 100);

    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
    ctx.font = "20px Arial";
    ctx.fillStyle = color;
    ctx.fillText(label, x0, y0 - 5);
    ctx.fillStyle = color.replace(")", ", 0.2)").replace("rgb", "rgba");
    ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
  }
  return [...new Set(classIds)];
}

function postprocessYolov7(
  ctx: CanvasRenderingContext2D,
  modelResolution: number[],
  tensor: Tensor,
  conf2color: (conf: number) => string
): number[] {
  const dx = ctx.canvas.width / modelResolution[0];
  const dy = ctx.canvas.height / modelResolution[1];

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  const classIds: number[] = [];
  let batch_id: number, x0: number, y0: number, x1: number, y1: number, cls_id: number, score: number;
  for (let i = 0; i < tensor.dims[0]; i++) {
    [batch_id, x0, y0, x1, y1, cls_id, score] = Array.from(
      (tensor.data as Float32Array).slice(i * 7, i * 7 + 7)
    ) as number[];

    classIds.push(cls_id);
    [x0, x1] = [x0, x1].map((x: number) => x * dx);
    [y0, y1] = [y0, y1].map((x: number) => x * dy);
    [x0, y0, x1, y1, cls_id] = [x0, y0, x1, y1, cls_id].map((x: number) =>
      round(x)
    );
    [score] = [round(score * 100, 1)];
    const label =
      yoloClasses[cls_id].toString()[0].toUpperCase() +
      yoloClasses[cls_id].toString().substring(1) +
      " " +
      score.toString() +
      "%";
    const color = conf2color(score / 100);

    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
    ctx.font = "20px Arial";
    ctx.fillStyle = color;
    ctx.fillText(label, x0, y0 - 5);
    ctx.fillStyle = color.replace(")", ", 0.2)").replace("rgb", "rgba");
    ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
  }
  return [...new Set(classIds)];
}
