import { RegexPatterns } from "../../lib/helpers/parsers";
import { CustomInput } from "./CustomInput";
import { useFormManager } from "./hooks/useFormManager";

export const GistBox = () => {
  const { registerComponent, unregisterComponent, canSave } = useFormManager();

  const handleGistboxChange = (value: string) => {
    //implement
  };

  return (
    <div>
      <CustomInput
        name="gistbox"
        value=""
        placeholder="e.g 1"
        label=""
        options={{
          editable: true,
          allowedChars: RegexPatterns.LettersNumbersSpecialCharsAndSpaces,
          hideContent: true,
          type: "large",
          size: "xl",
        }}
        callback={handleGistboxChange}
        register={registerComponent}
        unregister={unregisterComponent}
      ></CustomInput>
    </div>
  );
};
