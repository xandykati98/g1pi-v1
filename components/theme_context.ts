import { createContext } from 'react';
export const initialTheme = {
    primary: '#5ba6a5',
    bg: '#f5f7f9'
}
const ThemeContext = createContext(initialTheme);

export default ThemeContext