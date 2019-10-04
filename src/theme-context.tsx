import React from 'react'

const darkstyle = {
  backgroundColor: '#1a1a1a',
  color: '#bebebe'
};

const lightstyle = {
  backgroundColor: '#f7f7f7',
  color: '#171717'
};

const initialState = {
  dark: false,
  theme: lightstyle,
  toggle: () => {}
}

export const ThemeContext = React.createContext(initialState)

function ThemeProvider ({ children } : any) {
  const [dark, setDark] = React.useState(false)

  React.useEffect(() => {
    const dark = localStorage.getItem('dark') === 'true'
    setDark(dark)
  }, [dark])

  const toggle = () => {
    const isDark = !dark
    localStorage.setItem('dark', JSON.stringify(isDark))
    setDark(isDark)
  }

  const theme = dark ? lightstyle : darkstyle
 
  return (
    <ThemeContext.Provider value={{theme, dark, toggle}}>
      {children}
    </ThemeContext.Provider>
  )
}

export { ThemeProvider }
