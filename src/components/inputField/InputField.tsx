import style from "./input.module.scss";

interface IInput {
  value: string;
  type: string;
  label: string;
  setProperty: React.Dispatch<React.SetStateAction<string>>;
}

const InputFieled = ({ value, setProperty, type, label }: IInput) => {
  return (
    <div className={style.group}>
      <input
        required
        type={type}
        className={style.input}
        value={value}
        onChange={(e) => setProperty(e.target.value)}
        autoComplete="new-password"
      />
      <span className={style.highlight}></span>
      <span className={style.bar}></span>
      <label className={value !== "" ? style['label-floating'] : ""}>{label}</label>
    </div>
  );
};

export default InputFieled;
