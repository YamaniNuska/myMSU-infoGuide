/* eslint-disable react/no-unknown-property */
import Ionicons from "@expo/vector-icons/Ionicons";
import { useGLTF } from "@react-three/drei/native";
import { Canvas, useFrame, useThree } from "@react-three/fiber/native";
import { useRouter } from "expo-router";
import React, {
    Suspense,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import {
  ActivityIndicator,
  PanResponder,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as THREE from "three";
import type { GLTF } from "three-stdlib";

import campusMapModel from "../../../assets/map.glb";

const MIN_ZOOM = 0.55;
const MAX_ZOOM = 2.4;
const ZOOM_STEP = 0.18;

type CampusMapScreenProps = {
  onBack?: () => void;
};

type CampusModelProps = {
  rotationY: number;
  zoom: number;
  onReady: () => void;
};

type TouchPoint = {
  pageX: number;
  pageY: number;
};

type TouchEventLike = {
  nativeEvent: {
    touches?: TouchPoint[];
  };
};

type WheelEventLike = {
  preventDefault?: () => void;
  deltaY?: number;
  nativeEvent?: {
    deltaY?: number;
  };
};

const clampZoom = (value: number) =>
  Math.min(Math.max(value, MIN_ZOOM), MAX_ZOOM);

const getTouchDistance = (event: TouchEventLike) => {
  const touches = event.nativeEvent.touches;

  if (!touches || touches.length < 2) {
    return null;
  }

  const [firstTouch, secondTouch] = touches;
  const deltaX = secondTouch.pageX - firstTouch.pageX;
  const deltaY = secondTouch.pageY - firstTouch.pageY;

  return Math.hypot(deltaX, deltaY);
};

function CameraTarget() {
  const { camera } = useThree();

  useFrame(() => {
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function CampusModel({ rotationY, zoom, onReady }: CampusModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const { scene } = useGLTF(campusMapModel) as GLTF;

  const model = useMemo(() => {
    const clone = scene.clone(true);
    const bounds = new THREE.Box3().setFromObject(clone);
    const center = bounds.getCenter(new THREE.Vector3());
    const size = bounds.getSize(new THREE.Vector3());
    const largestSide = Math.max(size.x, size.y, size.z) || 1;
    const targetSize = 18;
    const scale = targetSize / largestSide;

    clone.scale.setScalar(scale);
    clone.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

    clone.traverse((object: THREE.Object3D) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
        object.frustumCulled = false;

        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material];

        materials.forEach((material) => {
          material.side = THREE.DoubleSide;
          material.needsUpdate = true;
        });
      }
    });

    clone.updateWorldMatrix(true, true);

    const fittedBounds = new THREE.Box3().setFromObject(clone);
    const fittedSphere = fittedBounds.getBoundingSphere(new THREE.Sphere());

    return {
      object: clone,
      radius: Math.max(fittedSphere.radius, targetSize / 2),
    };
  }, [scene]);

  useEffect(() => {
    const perspectiveCamera = camera as THREE.PerspectiveCamera;
    const fov = THREE.MathUtils.degToRad(perspectiveCamera.fov || 42);
    const distance = (model.radius / Math.sin(fov / 2)) * 0.72;

    perspectiveCamera.position.set(0, distance * 0.76, distance * 0.82);
    perspectiveCamera.near = 0.01;
    perspectiveCamera.far = distance * 40;
    perspectiveCamera.lookAt(0, 0, 0);
    perspectiveCamera.updateProjectionMatrix();

    onReady();
  }, [camera, onReady, model]);

  useFrame(() => {
    if (!groupRef.current) {
      return;
    }

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      rotationY,
      0.16,
    );
    groupRef.current.scale.setScalar(zoom);
  });

  return (
    <group ref={groupRef} rotation={[-0.08, rotationY, 0]}>
      <primitive object={model.object} />
    </group>
  );
}

export default function CampusMapScreen({ onBack }: CampusMapScreenProps) {
  const router = useRouter();
  const lastDragXRef = useRef(0);
  const lastPinchDistanceRef = useRef<number | null>(null);
  const [rotationY, setRotationY] = useState(-0.45);
  const [zoom, setZoom] = useState(1);
  const [isModelReady, setIsModelReady] = useState(false);

  const adjustZoom = useCallback((nextZoom: number) => {
    setZoom(clampZoom(nextZoom));
  }, []);

  const handleWheelZoom = useCallback((event: WheelEventLike) => {
    event.preventDefault?.();

    const deltaY = event.deltaY ?? event.nativeEvent?.deltaY ?? 0;
    const zoomDirection = deltaY > 0 ? -1 : 1;

    setZoom((current) => clampZoom(current + zoomDirection * ZOOM_STEP));
  }, []);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (event, gestureState) => {
          const touches = (event as TouchEventLike).nativeEvent.touches;

          return (
            Boolean(touches && touches.length >= 2) ||
            Math.abs(gestureState.dx) > 4 ||
            Math.abs(gestureState.dy) > 4
          );
        },
        onPanResponderGrant: (event) => {
          lastDragXRef.current = 0;
          lastPinchDistanceRef.current = getTouchDistance(
            event as TouchEventLike,
          );
        },
        onPanResponderMove: (event, gestureState) => {
          const pinchDistance = getTouchDistance(event as TouchEventLike);

          if (pinchDistance) {
            if (lastPinchDistanceRef.current) {
              const pinchRatio = pinchDistance / lastPinchDistanceRef.current;

              setZoom((current) => clampZoom(current * pinchRatio));
            }

            lastPinchDistanceRef.current = pinchDistance;
            return;
          }

          lastPinchDistanceRef.current = null;

          const deltaX = gestureState.dx - lastDragXRef.current;
          lastDragXRef.current = gestureState.dx;
          setRotationY((current) => current + deltaX * 0.008);
        },
        onPanResponderRelease: () => {
          lastPinchDistanceRef.current = null;
        },
        onPanResponderTerminate: () => {
          lastPinchDistanceRef.current = null;
        },
      }),
    [],
  );

  const viewerInteractionProps = useMemo(
    () =>
      ({
        ...panResponder.panHandlers,
        onWheel: handleWheelZoom,
      }) as typeof panResponder.panHandlers & {
        onWheel: (event: WheelEventLike) => void;
      },
    [handleWheelZoom, panResponder],
  );

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push("/");
    }
  };

  const handleZoomIn = () => {
    setZoom((current) => clampZoom(current + ZOOM_STEP));
  };

  const handleZoomOut = () => {
    setZoom((current) => clampZoom(current - ZOOM_STEP));
  };

  const handleReset = () => {
    setRotationY(-0.45);
    adjustZoom(1);
  };

  const handleModelReady = useCallback(() => {
    setIsModelReady(true);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <Text style={styles.title}>Campus Map</Text>
        <Text style={styles.subtitle}>
          Drag to rotate. Pinch or scroll to zoom.
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.viewer} {...viewerInteractionProps}>
          <Canvas
            camera={{ position: [0, 7, 9], fov: 38 }}
            gl={{ antialias: true }}
            shadows
            style={styles.canvas}
          >
            <color attach="background" args={["#F8F3EC"]} />
            <CameraTarget />
            <hemisphereLight args={["#FFFFFF", "#7B3F2F", 1.8]} />
            <ambientLight intensity={2.6} />
            <directionalLight position={[5, 9, 6]} intensity={2.8} castShadow />
            <directionalLight position={[-6, 5, -5]} intensity={1.3} />
            <Suspense fallback={null}>
              <CampusModel
                rotationY={rotationY}
                zoom={zoom}
                onReady={handleModelReady}
              />
            </Suspense>
          </Canvas>

          {!isModelReady && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator color="#800505" size="large" />
              <Text style={styles.loadingText}>Loading campus map</Text>
            </View>
          )}
        </View>

        <View style={styles.controls}>
          <Pressable style={styles.controlButton} onPress={handleZoomOut}>
            <Ionicons name="remove" size={20} color="#800505" />
          </Pressable>
          <Pressable style={styles.resetButton} onPress={handleReset}>
            <Ionicons name="refresh" size={18} color="#FFFFFF" />
            <Text style={styles.resetText}>{Math.round(zoom * 100)}%</Text>
          </Pressable>
          <Pressable style={styles.controlButton} onPress={handleZoomIn}>
            <Ionicons name="add" size={20} color="#800505" />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  header: {
    backgroundColor: "#800505",
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 22,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  backButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.14)",
    marginBottom: 16,
  },
  backText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
  },
  subtitle: {
    marginTop: 8,
    color: "rgba(255,255,255,0.84)",
    fontSize: 14,
    lineHeight: 21,
  },
  content: {
    flex: 1,
    padding: 18,
    gap: 14,
  },
  viewer: {
    flex: 1,
    minHeight: 420,
    overflow: "hidden",
    borderRadius: 24,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "rgba(128,5,5,0.12)",
  },
  canvas: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    gap: 12,
  },
  loadingText: {
    color: "#3F2626",
    fontSize: 14,
    fontWeight: "700",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  controlButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(128,5,5,0.16)",
  },
  resetButton: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 22,
    borderRadius: 24,
    backgroundColor: "#800505",
  },
  resetText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
