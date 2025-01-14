import React from 'react'
import { useState, useEffect ,useRef} from 'react'
import { v4 as uuidv4 } from 'uuid';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Manager = () => {
    const passRef = useRef()
    const eyeRef = useRef()
    const [passAraay, setpassAraay] = useState({ "website": "", "username": "", "password": "" })
    const [passwordArray, setpasswordArray] = useState([])
    const handleChange = (e) => {
        setpassAraay({ ...passAraay, [e.target.name]: e.target.value })
    }
    const savePass = () => {
        // localStorage.clear()
        console.log(passwordArray)
        setpasswordArray([...passwordArray, { ...passAraay, id: uuidv4() }])
        localStorage.setItem("passwords", JSON.stringify([...passwordArray, { ...passAraay, id: uuidv4() }]))
        setpassAraay({ website: "", username: "", password: "" })
    }
    useEffect(() => {
        let passfinder = localStorage.getItem("passwords")
        if (passfinder) {
            setpasswordArray(JSON.parse(passfinder))
        }
    }, [])

    const deletePassword = (id) => {
        setpasswordArray(passwordArray.filter(i => i.id !== id))
        localStorage.setItem("passwords", JSON.stringify(passwordArray.filter(i => i.id !== id)))

    }

    const editPassword = (id) => {
        setpassAraay(passwordArray.filter(i => i.id === id)[0])
        setpasswordArray(passwordArray.filter(i => i.id !== id))
        // localStorage.setItem("passwords", JSON.stringify(passwordArray.filter(i=>i.id!==id)))

    }

    const copyPass = (ip) => {
        toast('Copy to clipboard', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
                closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
        });
        
        navigator.clipboard.writeText(ip)
    }

    const showPass = () => {
        if (eyeRef.current.src.includes("openeye.png")) {
            eyeRef.current.src = "disableeye.png";
            passRef.current.type = "text";
        } else {
            eyeRef.current.src = "openeye.png";
            passRef.current.type = "password";
        }
    };


    return (

        <div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
            />
            <div className="logod">

                <span className='logotitle'>OpManager</span>
                <span>Your Own Password Manager</span>
            </div >
            <div className="inputfield">
                <input className='ipfield' onChange={handleChange} value={passAraay.website} type="text" name="website" placeholder='Enter website name' />
                <div className='innerinputfield'>
                    <input className='innerinputfield1' onChange={handleChange} value={passAraay.username} type="text" name="username" placeholder='Enter username' />
                    <div className="ipipfield">
                    <input ref={passRef} className='innerinputfield2' onChange={handleChange} value={passAraay.password} type="password" name="password" placeholder='Enter password' />
                    <span><img ref={eyeRef} onClick={showPass} className='eye' src="openeye.png" width={24} alt="openeye_img" /></span>
                    </div>
                </div>
                <button onClick={savePass} className='savebtn'>Save</button>
            </div>
            <div className="shpass">
                <p className='shtitle'> Your Passwords</p>
                {passwordArray.length === 0 ? (
                    <div>No passwords to show</div>
                ) : (
                    <table className='sptable'>
                        <thead className='thead'>
                            <tr>
                                <th >Website</th>
                                <th >Username</th>
                                <th >Password</th>
                                <th >Actions</th>
                            </tr>
                        </thead>
                        <tbody className='tbody'>
                            {passwordArray.map((item) => (
                                <tr key={item.id}>
                                    <td className='tabletd'>
                                        <a href="{item.website}"></a>
                                        {item.website}
                                    </td >
                                    <td className='tabletd'>
                                        {item.username}
                                        <span><img onClick={() => { copyPass(item.username) }} src="copy.png" width={16} alt="copy_img" style={{ marginLeft: 16, cursor: "pointer" }}
                                        /></span>
                                    </td>
                                    <td className='tabletd'>
                                        {"*".repeat(item.password.length)}
                                        <span><img onClick={() => { copyPass(item.password) }} src="copy.png" width={16} alt="copy_img" style={{ marginLeft: 16, cursor: "pointer" }}
                                        /></span>

                                    </td>
                                    <td className='tabletd2'>
                                        <img onClick={() => { editPassword(item.id) }} src="edit.svg" width={24} alt="edit_img" style={{ cursor: "pointer" }} />
                                        <img onClick={() => { deletePassword(item.id) }} src="delete.svg" width={24} alt="edit_img" style={{ cursor: "pointer" }} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

        </div>

    )
}

export default Manager