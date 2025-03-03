import Compass from "@/component/Compass";
import DeviceOrientation from "@/component/DeviceOrientation";
import UserLocation from "@/component/UserLocation";
import { View } from "react-native";


export default function Index() {
  return (
    <View style={{ flex: 1 }}>
      <Compass></Compass>
      {/* <UserLocation></UserLocation> */}
      {/* <DeviceOrientation></DeviceOrientation> */}
    </View >
  );
}
