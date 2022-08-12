import { useState, useEffect, useRef } from 'react'
import initThreeJs from './demo/index'
function App() {
	const threeJSDom = useRef()
	const [count, setCount] = useState(0)
	useEffect(() => {
		console.log('mounted event')
		initThreeJs(threeJSDom)
	}, [])

	return <div className='App' ref={threeJSDom}></div>
}

export default App
