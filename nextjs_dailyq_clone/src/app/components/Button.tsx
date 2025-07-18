import "./Button.module.css";

type ButtonType = {
  text : string,
  onClick : () => void ,
  className: string,
  children? : React.ReactNode | null,   
}

const Button = ({ text, onClick, className, children }:ButtonType) => {
  return (          
    <button className={className} onClick={onClick}>
      {text}
      {children}
    </button>
  );
};

export default Button;
