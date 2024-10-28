import { useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import { describeAllowedChars } from "../../lib/helpers/parsers";
import type { ComponentState } from "./hooks/useFormManager";
import { Icon } from "@iconify-icon/react";
import { useDebounce } from "@uidotdev/usehooks";

export const CustomInput = (props: {
  name: string;
  value: string;
  label?: string;
  placeholder?: string;
  options?: {
    type?: "normal" | "large";
    clipboard?: boolean;
    hideContent?: boolean;
    editable?: boolean;
    limit?: number;
    allowedChars?: RegExp;
    minValue?: number;
    maxValue?: number;
    size?: "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
    allowEmpty?: boolean;
  };
  callback?: (value: string) => void;
  onValidityChange?: (isValid: boolean) => void;
  register?: (
    name: string,
    onChange: () => ComponentState,
    onValidityChange: (isValid: boolean) => void,
  ) => void;
  unregister?: (name: string) => void;
}) => {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const [isHidden, setIsHidden] = useState(props.options?.hideContent ?? false);
  const [inputValue, setInputValue] = useState(props.value);
  const [valueChanged, setValueChanged] = useState(false);
  const [isValid, setIsValid] = useState(valueChanged);
  const debouncedInputValue = useDebounce(inputValue, 100);

  const sizeClasses = {
    xxs: "text-[0.6rem]", // Extra small size
    xs: "text-xs",
    sm: "text-sm", // Default size
    md: "text-base",
    lg: "text-base",
    xl: "text-base",
    "2xl": "text-base",
    "3xl": "text-base",
  };

  useEffect(() => {
    if (props.register === undefined || props.unregister === undefined) {
      return;
    }
    props.register(
      props.name,
      () => ({
        value: inputValue,
        isValid,
      }),
      (valid) => setIsValid(valid),
    );
    if (props.options?.allowEmpty && inputValue.length === 0) {
      setIsValid(true);
    }
    return () => {
      if (props.unregister === undefined) return;
      props.unregister(props.name);
    };
  }, [inputValue, isValid, props.register, props.unregister, props.name]);

  useEffect(() => {
    if (
      props.options?.limit ||
      props.options?.allowedChars ||
      props.options?.minValue ||
      props.options?.maxValue
    ) {
      validateInput();
    }
  }, [debouncedInputValue]);

  const copyToClipboard = () => {
    if (inputRef.current) {
      if (inputRef.current instanceof HTMLInputElement) {
        inputRef.current.select();
        inputRef.current.setSelectionRange(0, 99999);
      } else if (inputRef.current instanceof HTMLTextAreaElement) {
        inputRef.current.select();
      }
      let value = inputRef.current.value;
      navigator.clipboard.writeText(value);
      toast.info("Copied to clipboard");
    }
  };

  const switchHidden = () => {
    setIsHidden(!isHidden);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { value } = e.target;
    if (props.options?.editable) {
      setInputValue(value);
      setValueChanged(true);
    }
  };

  const validateInput = () => {
    if (!valueChanged) return;
    props.callback?.(debouncedInputValue.trim());
    let valid = true;
    let message = "";

    if (props.options?.limit && inputValue.length > props.options.limit) {
      valid = false;
      message = `Input exceeds the limit of ${props.options.limit} characters.`;
    }

    if (props.options?.allowEmpty && inputValue.length === 0) {
      valid = true;
    } else {
      if (
        props.options?.allowedChars &&
        !props.options.allowedChars.test(inputValue)
      ) {
        valid = false;
        message = `${describeAllowedChars(props.options.allowedChars)}`;
      }
    }

    const inputAsNumber = parseFloat(inputValue);
    if (!isNaN(inputAsNumber)) {
      if (
        props.options?.minValue !== undefined &&
        inputAsNumber < props.options.minValue
      ) {
        valid = false;
        message = `Value should be greater than or equal to ${props.options.minValue}.`;
      }
      if (
        props.options?.maxValue !== undefined &&
        inputAsNumber > props.options.maxValue
      ) {
        valid = false;
        message = `Value should be less than or equal to ${props.options.maxValue}.`;
      }
    }

    setIsValid(valid);
    if (valid) {
      inputRef.current?.classList.remove("border-red-400");
      toast.dismiss(props.name);
    } else {
      inputRef.current?.classList.add("border-red-400");
      toast.error(
        `${
          props.name.charAt(0).toUpperCase() + props.name.slice(1)
        } field contains errors: ${message}`,
        {
          id: props.name,
        },
      );
    }
    props.onValidityChange?.(valid);
  };

  const currentSize = props.options?.size || "xs"; // Default size set to "sm"

  return (
    <div
      className={`w-full flex flex-col place-content-center gap-px overflow-hidden font-mono relative bg-base-content/0 backdrop-blur-xl rounded-btn ${
        sizeClasses[currentSize]
      }  border-b transition-all ${
        !isValid && valueChanged ? "border-red-400" : "border-transparent"
      }`}
    >
      <div className="text-xs h-6 p-1 text-base-content font-light lowercase block">
        {props.label}
      </div>

      <div
        className={`input-bordered flex flex-wrap w-full items-center gap-1 relative`}
      >
        {props.options?.type === "large" ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            className={`textarea outline-none border-0 ring-0 focus:ring-0 focus:outline-none focus:border-0 disabled:bg-base-content/5  bg-base-content/5 w-full rounded-t-btn min-h-56  ${sizeClasses[currentSize]}`}
            value={inputValue}
            placeholder={props.placeholder}
            onChange={handleChange}
            disabled={!props.options?.editable}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type={isHidden ? "password" : "text"}
            className={`input outline-none  border-0 ring-0 focus:ring-0 focus:outline-none focus:border-0 rounded-t-btn disabled:bg-base-content/10 bg-base-content/10 placeholder:text-base-content/50 w-full  ${sizeClasses[currentSize]}`}
            value={inputValue}
            placeholder={props.placeholder}
            onChange={handleChange}
            disabled={!props.options?.editable}
          />
        )}
        <div
          className={`absolute ${props.options?.limit && debouncedInputValue.length > 0 ? "right-0 top-0 gap-px p-px" : "right-1 gap-1 p-1"}  flex  bg-base-100/50 backdrop-blur-xl  rounded-btn ${
            !props.options?.clipboard && !props.options?.hideContent
              ? "hidden"
              : ""
          }`}
        >
          {props.options?.clipboard && (
            <button
              onClick={copyToClipboard}
              className="rounded-btn kbd kbd-sm"
            >
              <Icon icon="ion:clipboard" width={"0.75rem"} />
            </button>
          )}
          {props.options?.type !== "large" && props.options?.hideContent && (
            <button onClick={switchHidden} className="rounded-btn kbd kbd-sm">
              {!isHidden ? (
                <Icon icon="ion:eye-off" width={"0.75rem"} />
              ) : (
                <Icon icon="ion:eye" width={"0.75rem"} />
              )}
            </button>
          )}
        </div>
      </div>

      {props.options?.limit && debouncedInputValue.length > 0 && (
        <span
          className={`bg-base-200/80 p-2 rounded-tl-btn align-middle text-center text-[0.50rem] backdrop-blur-xl flex place-content-center place-items-center text-base-content/80 absolute bottom-0 right-0 ${
            inputValue.length > props.options.limit ? "text-red-400" : ""
          }`}
        >
          {inputValue.length}/{props.options.limit}
        </span>
      )}
    </div>
  );
};
