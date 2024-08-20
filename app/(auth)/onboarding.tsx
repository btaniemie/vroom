import { router } from "expo-router";
import { useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";

const onboarding = () => {
    const swiperRef = useRef<Swiper>(null);
    return (
        <SafeAreaView className="flex h-full items-center justify-between bg-white">
            <TouchableOpacity onPress={() => {
                router.replace('/(auth)/sign-up')
            }} className="w-full flex justify-end items-end p-5">
                <Text className="text-black text-md font-bold">Skip</Text>
            </TouchableOpacity>

        </SafeAreaView>
    )
}

export default onboarding;