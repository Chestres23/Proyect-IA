import React, { useEffect, useRef, useState } from "react";
import "./FaceGate.css";
import firmaService from "../services/firmaService";

const FACE_API_CDN =
  "https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js";
const FACE_API_MODELS =
  "https://justadudewhohacks.github.io/face-api.js/models";

function FaceGate({ onVerified }) {
  const videoRef = useRef(null);
  const intervalRef = useRef(null);
  const streamRef = useRef(null);

  const [status, setStatus] = useState("loading");
  const [statusText, setStatusText] = useState("Iniciando sensores...");
  const [faceDetected, setFaceDetected] = useState(false);
  const [firmaCode, setFirmaCode] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [actionStatus, setActionStatus] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const stopCamera = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };

    const loadScript = () =>
      new Promise((resolve, reject) => {
        if (window.faceapi) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = FACE_API_CDN;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("No se pudo cargar face-api"));
        document.head.appendChild(script);
      });

    const loadModels = async () => {
      await window.faceapi.nets.tinyFaceDetector.loadFromUri(FACE_API_MODELS);
    };

    const startVideo = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    };

    const startDetection = () => {
      if (!videoRef.current) return;

      const detectorOptions = new window.faceapi.TinyFaceDetectorOptions({
        inputSize: 416,
        scoreThreshold: 0.4
      });

      intervalRef.current = setInterval(async () => {
        if (!videoRef.current || videoRef.current.readyState < 2) return;
        const detection = await window.faceapi.detectSingleFace(
          videoRef.current,
          detectorOptions
        );
        const hasFace = Boolean(detection);
        setFaceDetected((prev) => (prev !== hasFace ? hasFace : prev));
        setStatusText(hasFace ? "Persona detectada" : "Camara vacia");
        if (!hasFace) {
          setIsValid(false);
          setActionMessage("");
          setActionStatus("");
        }
      }, 300);
    };

    const init = async () => {
      try {
        setStatus("loading");
        await loadScript();
        if (cancelled) return;
        await loadModels();
        if (cancelled) return;
        await startVideo();
        if (cancelled) return;
        setStatus("ready");
        setStatusText("Escaneando...");
        startDetection();
      } catch (err) {
        if (cancelled) return;
        console.error(err);
        setError("No se pudo iniciar la camara o el detector.");
        setStatus("error");
      }
    };

    init();

    return () => {
      cancelled = true;
      stopCamera();
    };
  }, []);

  const handleValidate = async () => {
    if (!firmaCode.trim()) {
      setActionMessage("Ingresa la firma para validar.");
      setActionStatus("error");
      return;
    }

    try {
      setIsValidating(true);
      const result = await firmaService.validarEmpleado(firmaCode.trim());
      if (result?.success) {
        setIsValid(true);
        setActionStatus("success");
        setActionMessage("Firma valida. Puedes ingresar.");
      } else {
        setIsValid(false);
        setActionStatus("error");
        setActionMessage(result?.message || "Firma no valida.");
      }
    } catch (err) {
      setIsValid(false);
      setActionStatus("error");
      setActionMessage(err.message || "No se pudo validar la firma.");
    } finally {
      setIsValidating(false);
    }
  };

  const handleRegister = async () => {
    if (!firmaCode.trim()) {
      setActionMessage("Ingresa la firma para registrar.");
      setActionStatus("error");
      return;
    }

    try {
      setIsRegistering(true);
      const result = await firmaService.registrar(firmaCode.trim());
      if (result?.success) {
        setActionStatus("success");
        setActionMessage(result?.message || "Firma registrada.");
      } else {
        setActionStatus("error");
        setActionMessage(result?.message || "No se pudo registrar.");
      }
    } catch (err) {
      setActionStatus("error");
      setActionMessage(err.message || "Error registrando firma.");
    } finally {
      setIsRegistering(false);
    }
  };

  const handleEnter = () => {
    if (isValid && faceDetected) {
      onVerified();
    }
  };

  return (
    <div className="face-gate-overlay">
      <div className="face-gate-card">
        <div className="face-gate-headline">
          <p className="face-gate-eyebrow">Bienvenido</p>
          <h2 className="face-gate-title">Verificacion de rostro</h2>
          <p className="face-gate-subtitle">
            Verifica tu identidad antes de ingresar.
          </p>
        </div>

        <div
          className={
            "face-gate-video" +
            (faceDetected ? " face-detected" : " face-not-detected")
          }
        >
          <video ref={videoRef} autoPlay muted playsInline />
        </div>

        <div className="face-gate-status">
          {status === "loading" && "Iniciando sensores..."}
          {status === "ready" && statusText}
          {status === "error" && error}
        </div>

        {faceDetected && (
          <div className="face-gate-signature">
            <div className="face-gate-form">
              <label htmlFor="firma">Firma</label>
              <input
                id="firma"
                type="text"
                value={firmaCode}
                onChange={(e) => setFirmaCode(e.target.value)}
                placeholder="Ingresa tu firma"
              />
            </div>

            {actionMessage && (
              <div
                className={
                  "face-gate-message" +
                  (actionStatus === "success" ? " message-success" : " message-error")
                }
              >
                {actionMessage}
              </div>
            )}

            <div className="face-gate-actions">
              <button
                type="button"
                className="face-gate-btn secondary"
                onClick={handleValidate}
                disabled={isValidating}
              >
                {isValidating ? "Validando..." : "Validar firma"}
              </button>
              <button
                type="button"
                className="face-gate-btn"
                onClick={handleRegister}
                disabled={isRegistering}
              >
                {isRegistering ? "Registrando..." : "Registrar firma"}
              </button>
              <button
                type="button"
                className="face-gate-btn success"
                onClick={handleEnter}
                disabled={!isValid}
              >
                Ingresar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FaceGate;
