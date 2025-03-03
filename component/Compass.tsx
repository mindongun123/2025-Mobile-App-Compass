import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle, Line, Text as SvgText } from "react-native-svg";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import * as Location from "expo-location";
import { Magnetometer } from "expo-sensors";

const COMPASS_SIZE = 400;
const CENTER = 100;
const RADIUS = 90;

const Compass: React.FC = () => {
    const lastDirection = useRef<number>(0);
    const [direction, setDirection] = useState<number>(220);
    const rotate = useSharedValue(220);
    const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
    const [errorMsg, setErrorMsg] = useState("");
    const [angle, setAngle] = useState(0);

    useEffect(() => {
        let subscription: { remove: () => void } | null = null;

        const startWatching = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                setErrorMsg("Bạn chưa cấp quyền truy cập vị trí!");
                return;
            }

            subscription = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.BestForNavigation,
                    timeInterval: 500,
                    distanceInterval: 1,
                },
                (loc) => {
                    setLocation(loc.coords);
                }
            );
        };

        startWatching();

        return () => {
            if (subscription) {
                subscription.remove();
            }
        };
    }, []);

    useEffect(() => {
        let subscription = Magnetometer.addListener((data) => {
            let { x, y } = data;
            let newAngle = Math.atan2(y, x) * (180 / Math.PI);
            newAngle = (newAngle + 270 + 360) % 360;
            setAngle(Math.round(newAngle));
        });

        return () => {
            subscription && subscription.remove();
        };
    }, []);

    useEffect(() => {
        const newDirection = (angle + 90) % 360;
        const currentDirection = rotate.value % 360;
        let delta = newDirection - currentDirection;

        if (delta > 180) delta -= 360;
        else if (delta < -180) delta += 360;

        const finalDirection = currentDirection + delta;

        if (finalDirection !== lastDirection.current) {
            lastDirection.current = finalDirection;
            setDirection(finalDirection);
            rotate.value = withSpring(finalDirection, { damping: 5, stiffness: 100 });
        }
    }, [angle]);


    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${-rotate.value}deg` }],
    }));

    return (
        <View style={styles.all}>
            <View style={styles.container}>
                <Animated.View style={[animatedStyle]}>
                    <Svg width={COMPASS_SIZE} height={COMPASS_SIZE} viewBox="0 0 200 200">
                        <Circle cx="100" cy="100" r="90" stroke="white" strokeWidth="0" fill="black" />
                        {Array.from({ length: 360 }).map((_, i) => {
                            const rad = (i * Math.PI) / 180;
                            const x1 = CENTER + RADIUS * Math.cos(rad);
                            const y1 = CENTER + RADIUS * Math.sin(rad);
                            const x2 = CENTER + (RADIUS - (i % 30 === 0 ? 10 : 5)) * Math.cos(rad);
                            const y2 = CENTER + (RADIUS - (i % 30 === 0 ? 10 : 5)) * Math.sin(rad);
                            const textX = CENTER + (RADIUS - 20) * Math.cos(rad);
                            const textY = CENTER + (RADIUS - 20) * Math.sin(rad);

                            return (
                                <React.Fragment key={i}>
                                    <Line
                                        x1={x1} y1={y1} x2={x2} y2={y2}
                                        stroke={i === 0 ? "red" : "white"}
                                        strokeWidth={i % 30 === 0 ? 1.5 : 0.5}
                                    />
                                    {i % 30 === 0 && (
                                        <SvgText
                                            x={textX} y={textY}
                                            fontSize={10}
                                            fill="white"
                                            textAnchor="middle"
                                            alignmentBaseline="middle"
                                        >
                                            {i}°
                                        </SvgText>
                                    )}
                                </React.Fragment>
                            );
                        })}
                        <SvgText x="95" y="20" fill="white" fontSize="16" fontWeight="bold">T</SvgText>
                        <SvgText x="95" y="185" fill="white" fontSize="16" fontWeight="bold">Đ</SvgText>
                        <SvgText x="175" y="105" fill="white" fontSize="16" fontWeight="bold">B</SvgText>
                        <SvgText x="15" y="105" fill="white" fontSize="16" fontWeight="bold">N</SvgText>
                    </Svg>
                </Animated.View>

                <View style={styles.needleContainer}>
                    <Svg width="400" height="400" viewBox="0 0 400 400">
                        <Line x1="200" y1="10" x2="200" y2="68" stroke="red" strokeWidth="3" strokeLinecap="round" />
                        <Line x1="200" y1="120" x2="200" y2="280" stroke="white" strokeWidth="1" />
                        <Line x1="110" y1="200" x2="280" y2="200" stroke="white" strokeWidth="1" />
                    </Svg>
                </View>
            </View>

            <Text style={styles.angleText}>{Math.round(angle)}°</Text>
            <View style={styles.locationContainer}>
                <Text style={styles.locationTitle}>📍 Vị trí hiện tại:</Text>
                {location ? (
                    <Text style={styles.locationText}>
                        Latitude: {location.latitude}{"\n"}
                        Longitude: {location.longitude.toFixed(4)}{"\n"}
                        <Text>Hướng: {angle}°</Text>
                    </Text>
                ) : (
                    <Text style={styles.locationText}>{errorMsg || "Đang lấy vị trí..."}</Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    all: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
    },
    container: {
        justifyContent: "center",
        alignItems: "center",
    },
    needleContainer: {
        position: "absolute",
        width: 400,
        height: 400,
        justifyContent: "center",
        alignItems: "center",
    },
    angleText: {
        fontSize: 32,
        color: "white",
        fontWeight: "bold",
        marginTop: 20,
        textAlign: "center",
    },
    locationContainer: {
        marginTop: 20,
        alignItems: "center",
        padding: 10,
        borderRadius: 10,
        backgroundColor: "#222",
    },
    locationTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
    },
    locationText: {
        fontSize: 16,
        color: "white",
        marginTop: 5,
        textAlign: "center",
    },
});

export default Compass;