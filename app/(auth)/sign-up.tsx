import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, Image, ScrollView, Text, View } from "react-native";
import ReactNativeModal from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context";

const SignUp = () => {
    const { isLoaded, signUp, setActive } = useSignUp()
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
      });

      const [verification, setVerification] = useState({
        state: "default",
        error: "",
        code: "",
      });

      const onSignUpPress = async () => {
        if (!isLoaded) {
          return
        }
    
        try {
          await signUp.create({
            emailAddress: form.email,
            password: form.password,
          })
    
          await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
    
          setVerification({
            ...verification,
            state: "pending",
          });
        } catch (err: any) {
          // See https://clerk.com/docs/custom-flows/error-handling
          // for more info on error handling
          console.error(JSON.stringify(err, null, 2))
          Alert.alert("Error", err.errors[0].longMessage);
        }
      }
    
      const onPressVerify = async () => {
        if (!isLoaded) {
          return
        }
    
        try {
          const completeSignUp = await signUp.attemptEmailAddressVerification({
            code: verification.code
          })
    
          if (completeSignUp.status === 'complete') {
            await setActive({ session: completeSignUp.createdSessionId })
            setVerification({
                ...verification,
                state: "success",
            });
          } else {
            setVerification({
                ...verification,
                error: "Verification failed. Please try again.",
                state: "failed",
            });
          }
        } catch (err: any) {
          // See https://clerk.com/docs/custom-flows/error-handling
          // for more info on error handling
          setVerification({
            ...verification,
            error: err.errors[0].longMessage,
            state: "failed",
          });
        }
      }
    

    return (
        <ScrollView className="flex-1 bg-white">
            <View className="flex-1 bg-white">
                <View className="relative w-full h-[250px]">
                    <Image source={images.signUpCar} className="z-0 w-full h-[250px]"/>
                    <Text className="text-2xl text-black font-semibold absolute bottom-5 left-5">
                        Get Started 🚀
                    </Text>
                </View>
            <View className="p-5">
                <InputField 
                    label="Name"
                    placeholder="Enter name"
                    icon={icons.person}
                    value={form.name}
                    onChangeText={(value) => setForm({ ...form, name: value })}
                />
                <InputField
                    label="Email"
                    placeholder="Enter email"
                    icon={icons.email}
                    textContentType="emailAddress"
                    value={form.email}
                    onChangeText={(value) => setForm({ ...form, email: value })}
                />
                <InputField
                    label="Password"
                    placeholder="Enter password"
                    icon={icons.lock}
                    secureTextEntry={true}
                    textContentType="password"
                    value={form.password}
                    onChangeText={(value) => setForm({ ...form, password: value })}
                />
                <CustomButton 
                    title="Sign Up"
                    onPress={onSignUpPress}
                    className="mt-6"
                />
                
                <OAuth />
                <Link
                    href="/sign-in"
                    className="text-lg text-center text-general-200 mt-10"
                >
                    Created an account?{" "}
                    <Text className="text-[#006A4E]">Sign In</Text>
                </Link>
            </View>

            <ReactNativeModal 
              isVisible={verification.state === 'pending'}
              onModalHide={() => {
                if (verification.state === "success") {
                  setShowSuccessModal(true);
                }
              }}
            >
              <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
                <Text className="font-extrabold text-2xl mb-2">
                  Verification
                </Text>
                <Text className="font-medium mb-5">
                  A code to verify your account has been sent to {form.email}
                </Text>
              <InputField
                label={"Code"}
                icon={icons.lock}
                placeholder={"12345"}
                value={verification.code}
                keyboardType="numeric"
                onChangeText={(code) =>
                  setVerification({ ...verification, code })
                }
              />

              {verification.error && (
                <Text className="text-red-500 text-sm mt-1">
                  {verification.error}
                </Text>
              )}

              <CustomButton
                title="Verify"
                onPress={onPressVerify}
                className="mt-5 bg-success-500"
              />
              </View>
            </ReactNativeModal>

            <ReactNativeModal isVisible={showSuccessModal}>
              <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
                  <Image
                  source={images.check}
                  className="w-[110px] h-[110px] mx-auto my-5"
                />

                <Text className="text-3xl font-bold text-center">
                  Completed
                </Text>
                <Text className="text-base text-gray-400 font-medium text-center mt-2">
                  Your account is successfully verified.
                </Text>

                <CustomButton
                  title="Next"
                  onPress={() => {
                    setShowSuccessModal(false)
                    router.push(`/(root)/(tabs)/home`)
                  }}
                  className="mt-5"
                />
              </View>
            </ReactNativeModal>
        </View>          
        </ScrollView>
    )
}

export default SignUp;