import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Magnetometer } from "expo-sensors";

const DeviceOrientation = () => {
    const [angle, setAngle] = useState(0);

    useEffect(() => {
        let subscription = Magnetometer.addListener((data) => {
            let { x, y } = data;
            let angle = Math.atan2(y, x) * (180 / Math.PI);
            if (angle < 0) {
                angle += 360;
            }
            setAngle(parseFloat(angle.toFixed(2)));
        });

        return () => {
            subscription && subscription.remove();
        };
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Hướng: {angle}°</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
    },
    text: {
        fontSize: 24,
        color: "white",
        fontWeight: "bold",
    },
});

export default DeviceOrientation;