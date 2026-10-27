import AsyncStorage from "@react-native-async-storage/async-storage";
import Reactotron from "reactotron-react-native";

const reactotron = Reactotron.setAsyncStorageHandler(AsyncStorage)
  .configure({
    name: "ArtSync",
    host: "localhost",
  })
  .useReactNative({
    asyncStorage: true,
    networking: {
      ignoreUrls: /symbolicate/,
    },
  })
  .connect();

// Sobrescribir console.log para que se reenvíen automáticamente a Reactotron
const originalLog = console.log;
console.log = (...args) => {
  originalLog(...args);
  Reactotron.display({
    name: "LOG",
    preview: args
      .map((a) => (typeof a === "object" ? JSON.stringify(a) : String(a)))
      .join(" "),
    value: args,
  });
};

export default reactotron;
