import styled from "styled-components";
import { toggleTheme } from "../redux/ThemeSlice";
import { useDispatch, useSelector } from "react-redux";
const ThemeSwitch = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);
  const dispatch = useDispatch();

  return (
    <StyledWrapper>
      <div className="toggle-switch">
        <label className="switch-label">
          <input
            type="checkbox"
            className="checkbox"
            checked={!darkMode}
            onChange={() => dispatch(toggleTheme())}
          />
          <span className="slider" />
        </label>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .toggle-switch {
    position: relative;
    width: 100px;
    height: 50px;
    --light: #d8dbe0;
    --dark: #28292c;
    --link: rgb(27, 129, 112);
    --link-hover: rgb(24, 94, 82);
  }

  .switch-label {
    position: absolute;
    width: 100%;
    height: 50px;
    background-color: var(--dark);
    border-radius: 25px;
    cursor: pointer;
    border: 3px solid var(--dark);
  }

  .checkbox {
    position: absolute;
    display: none;
  }

  .slider {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 25px;
    transition: 0.3s;
  }

  .checkbox:checked ~ .slider {
    background-color: var(--light);
  }

  .slider::before {
    content: "";
    position: absolute;
    top: 10px;
    left: 10px;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    box-shadow: inset 12px -4px 0px 0px var(--light);
    background-color: var(--dark);
    transition: 0.3s;
  }

  .checkbox:checked ~ .slider::before {
    transform: translateX(50px);
    background-color: var(--dark);
    box-shadow: none;
  }
`;

export default ThemeSwitch;
