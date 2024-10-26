import { useEffect, useState } from "react";
import type { ComponentState } from "./hooks/useFormManager";

export const CustomCheckbox = (props: {
  name: string;
  value: boolean;
  titleLabel: string;
  actionLabel: string;
  extraInfo?: string;
  callback: (isChecked: boolean) => void;
  register?: (
    name: string,
    onChange: () => ComponentState,
    onValidityChange: (isValid: boolean) => void,
  ) => void;
  unregister?: (name: string) => void;
}) => {
  const [isChecked, setisChecked] = useState(props.value);
  const [isValid, setIsValid] = useState(true);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setisChecked(e.target.checked);
    props.callback(e.target.checked);
  };

  useEffect(() => {
    if (props.register === undefined || props.unregister === undefined) {
      return;
    }
    props.register(
      props.name,
      () => ({
        value: isChecked.toString(),
        isValid: isValid,
      }),
      (valid) => setIsValid(valid),
    );

    return () => {
      if (props.unregister === undefined) return;
      props.unregister(props.name);
    };
  }, [, isValid, props.register, props.unregister, props.name]);

  return (
    <div className="flex flex-col gap-1 md:max-w-96 font-mono relative">
      <span className=" text-xs font-bold">{props.titleLabel}</span>
      <div className="form-control bg-base-content/5 backdrop-blur-xl rounded-btn w-full p-2">
        <label className="label cursor-pointer">
          <span className="label-text text-xs">{props.actionLabel}</span>
          <input
            onChange={(e) => handleChange(e)}
            type="checkbox"
            checked={isChecked}
            className="checkbox"
          />
        </label>
        <span className="text-xs text-base-content/50 px-1">
          {props.extraInfo}
        </span>
      </div>
    </div>
  );
};
