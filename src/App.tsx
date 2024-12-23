import React from "react";
import SmartInputInt from "./components/smart-input-int";

function App() {
  const [value, setValue] = React.useState<number>(-50);

  // React.useEffect(() => {
  //   console.log("value", value);
  // }, [value]);

  return (
    <div>
      <p>smart input integer</p>
      <SmartInputInt
        className="border focus-visible:outline-none"
        input={value}
        min={-100}
        max={-1}
        onInputChange={(v) => setValue(v)}
      />
    </div>
  );
}

export default App;
