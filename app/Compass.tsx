import React, { useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import Svg, { Circle, Line, Text as SvgText } from "react-native-svg";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

const COMPASS_SIZE = 400; // Kích thước la bàn
const CENTER = 100;
const RADIUS = 90;

const Compass: React.FC = () => {
    const [direction, setDirection] = useState<number>(220); // Góc giả lập ban đầu
    const rotate = useSharedValue(220); // Xoay la bàn thay vì kim

    // Hiệu ứng quay toàn bộ la bàn
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${-rotate.value}deg` }], // Đảo ngược hướng để kim đứng yên
    }));

    // Đổi góc ngẫu nhiên
    const updateDirection = () => {
        const newAngle = Math.floor(Math.random() * 360);
        setDirection(newAngle);
        rotate.value = withSpring(newAngle, { damping: 5, stiffness: 100 });
    };

    // Xác định phương hướng từ góc
    const getDirectionName = (angle: number): string => {
        if (angle >= 337.5 || angle < 22.5) return "Bắc";
        if (angle >= 22.5 && angle < 67.5) return "Đông Bắc";
        if (angle >= 67.5 && angle < 112.5) return "Đông";
        if (angle >= 112.5 && angle < 157.5) return "Đông Nam";
        if (angle >= 157.5 && angle < 202.5) return "Nam";
        if (angle >= 202.5 && angle < 247.5) return "Tây Nam";
        if (angle >= 247.5 && angle < 292.5) return "Tây";
        if (angle >= 292.5 && angle < 337.5) return "Tây Bắc";
        return "Không xác định";
    };

    // Vẽ 360 nét trên vòng tròn
    const renderTicks = () => {
        return Array.from({ length: 360 }).map((_, i) => {
            const angle = (i * Math.PI) / 180;
            const x1 = CENTER + RADIUS * Math.cos(angle);
            const y1 = CENTER + RADIUS * Math.sin(angle);
            const x2 = CENTER + (RADIUS - (i % 30 === 0 ? 10 : 5)) * Math.cos(angle);
            const y2 = CENTER + (RADIUS - (i % 30 === 0 ? 10 : 5)) * Math.sin(angle);
            return <Line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={i === 0 ? "red" : "white"} strokeWidth={i % 30 === 0 ? 1.5 : 0.5} />;
        });
    };

    return (
        <View style={styles.all}>
            <View style={styles.container}>
                {/* La bàn (xoay toàn bộ) */}
                <Animated.View style={[animatedStyle]}>
                    <Svg width={COMPASS_SIZE} height={COMPASS_SIZE} viewBox="0 0 200 200">
                        {/* Vòng tròn */}
                        <Circle cx="100" cy="100" r="90" stroke="white" strokeWidth="0" fill="black" />
                        {/* Nét kẻ */}
                        {renderTicks()}
                        {/* Phương hướng */}
                        <SvgText x="95" y="20" fill="white" fontSize="16" fontWeight="bold">B</SvgText>
                        <SvgText x="95" y="185" fill="white" fontSize="16" fontWeight="bold">N</SvgText>
                        <SvgText x="175" y="105" fill="white" fontSize="16" fontWeight="bold">Đ</SvgText>
                        <SvgText x="15" y="105" fill="white" fontSize="16" fontWeight="bold">T</SvgText>
                    </Svg>
                </Animated.View>


                {/* Kim la bàn (luôn đứng yên) */}
                <View style={styles.needleContainer}>
                    <Svg width="400" height="400" viewBox="0 0 400 400">
                        <Line x1="200" y1="10" x2="200" y2="68" stroke="red" strokeWidth="3" strokeLinecap="round" />
                        <Line x1="200" y1="120" x2="200" y2="280" stroke="white" strokeWidth="1" />
                        <Line x1="110" y1="200" x2="280" y2="200" stroke="white" strokeWidth="1" />
                    </Svg>
                </View>


            </View>
            {/* Hiển thị góc và phương hướng */}
            <Text style={styles.angleText}>{Math.round(direction)}° {getDirectionName(direction)}</Text>

            {/* Nút đổi hướng */}
            <Button title="Đổi hướng giả lập" onPress={updateDirection} color="#007AFF" />
        </View>
    );
};
const styles = StyleSheet.create({
    all: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000"
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
    needle: {
        position: "absolute",
        width: 200,
        height: 200,
    },
    angleText: {
        fontSize: 32,
        color: "white",
        fontWeight: "bold",
        marginTop: 20,
        textAlign: "center",
    },
});
export default Compass;
