import { InputPassword } from "../InputPassword/InputPassword";
import "./PasswordGroup.css"

export function PasswordGroup({classname ,setPassword, setConfirmPassword }: PasswordGroupInterface) {
  
    return (
        <div className={`${classname} input__password`}>
            <div>
                <InputPassword
                label="Password"
                id="password"
                OnChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                />
            </div>

            <div>
                <InputPassword
                label="Confirm Password"
                id="confirm-password"
                OnChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                />
            </div>
        </div>
    );
}

interface PasswordGroupInterface {
    classname: string
    setPassword(value: string): void
    setConfirmPassword(value: string):void;
}