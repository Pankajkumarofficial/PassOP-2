import React, { useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const Manager = () => {
    const ref = useRef();
    const passwordRef = useRef();
    const [form, setForm] = useState({ site: "", username: "", password: "" });
    const [passwordArray, setPasswordArray] = useState([]);

    const getPassword = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/passwords");
            if (Array.isArray(response.data)) {
                setPasswordArray(response.data);
            } else {
                console.error("Invalid data format:", response.data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getPassword();
    }, []);

    const showPassword = () => {
        if (ref.current.src.includes("icons/eyecross.webp")) {
            ref.current.src = "icons/eye.webp";
            passwordRef.current.type = 'password';
        } else {
            ref.current.src = "icons/eyecross.webp";
            passwordRef.current.type = 'text';
        }
    };

    const savePassword = async () => {
        if (form.site.length > 3 && form.username.length > 3 && form.password.length > 3) {
            const newId = uuidv4(); // Generate a new ID once
            form.id = newId;

            try {
                // Delete the previous entry if it exists
                await axios.delete("http://localhost:8080/api/passwords", {
                    data: { id: form.id }
                });

                // Update passwordArray with the new entry
                setPasswordArray(prevPasswordArray => [...prevPasswordArray, { ...form, id: newId }]);

                // Add the new entry
                await axios.post("http://localhost:8080/api/passwords", { ...form, id: newId });

                setForm({ site: "", username: "", password: "" });

                toast('Password Saved', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            } catch (error) {
                console.error(error);
                toast("Password not saved");
            }
        } else {
            toast("Password not saved");
        }
    };

    const deletePassword = async (id) => {
        console.log("Delete successfully " + id);
        let c = confirm("Are you sure you want to delete");
        if (c) {
            setPasswordArray(passwordArray.filter(item => item.id !== id));
            try {
                await axios.delete("http://localhost:8080/api/passwords", {
                    data: { id }
                });
                toast('Password Deleted', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            } catch (error) {
                console.error(error);
            }
        }
    };

    const editPassword = (id) => {
        console.log("Edit successfully " + id);
        setForm({ ...passwordArray.filter(i => i.id === id)[0], id: id });
        setPasswordArray(passwordArray.filter(item => item.id !== id));
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const copyText = (text) => {
        toast('Copy to clipboard', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
        navigator.clipboard.writeText(text);
    };

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light" />
            {/* Same as */}
            <ToastContainer />

            <div className="absolute inset-0 -z-10 h-full w-full bg-green-50 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"><div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-green-400 opacity-20 blur-[100px]"></div></div>

            <div className="p-3 md:p-0 md:mycontainer min-h-[83.5vh]">
                <h1 className='text-4xl font-bold text-center'>
                    <span className='text-green-500'>&lt;</span>
                    <span>Pass</span>
                    <span className='text-green-500'>OP/&gt;</span>
                </h1>
                <p className='text-green-900 text-lg text-center'>Your Password Manager</p>
                <div className='flex flex-col p-4 text-black gap-6 items-center'>
                    <input value={form.site} onChange={handleChange} placeholder='Enter website URL' name='site' id='site' className='rounded-full border border-green-500 w-full p-4 py-1' type="text" />
                    <div className="flex flex-col md:flex-row w-full gap-6 justify-between">
                        <input value={form.username} onChange={handleChange} placeholder='Enter Username' className='rounded-full border border-green-500 w-full p-4 py-1' type="text" name='username' id='username' />
                        <div className="relative">
                            <input ref={passwordRef} value={form.password} onChange={handleChange} placeholder='Enter Password' className='rounded-full border border-green-500 w-full p-4 py-1' type="password" name='password' id='password' />
                            <span className='absolute right-[3px] top-[4px] cursor-pointer' onClick={showPassword}>
                                <img ref={ref} className='p-1' width={26} src="icons/eye.webp" alt="" />
                            </span>
                        </div>
                    </div>
                    <button onClick={savePassword} className='flex justify-center gap-2 items-center bg-green-400 rounded-full px-6 py-2 w-fit border border-green-900 hover:bg-green-300'>
                        <lord-icon
                            src="https://cdn.lordicon.com/jgnvfzqg.json"
                            trigger="hover">
                        </lord-icon>
                        Save Password
                    </button>
                </div>
                <div className="passwords">
                    <h2 className='font-bold text-2xl py-4'>Your Passwords</h2>
                    {passwordArray.length === 0 && <div>No Passwords to show</div>}
                    {passwordArray.length != 0 && <table className="table-auto w-full rounded-md overflow-hidden mb-10">
                        <thead className='bg-green-800 text-white'>
                            <tr>
                                <th className='py-2'>Site</th>
                                <th className='py-2'>Username</th>
                                <th className='py-2'>Password</th>
                                <th className='py-2'>Actions</th>
                            </tr>
                        </thead>
                        <tbody className='bg-green-100'>
                            {passwordArray.map((item, index) => {
                                return <tr key={index}>
                                    <td className='text-center border border-white py-2'>
                                        <div className='flex justify-center items-center'><a href={item.site} target='_blank'>{item.site}</a>
                                            <div className='copyicon size-7 cursor-pointer' onClick={() => copyText(item.site)}>
                                                <i style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }} className="fa-solid fa-copy"></i>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='text-center border border-white py-2'>
                                        <div className='flex justify-center items-center'><span>{item.username}</span>
                                            <div className='copyicon size-7 cursor-pointer' onClick={() => copyText(item.username)}>
                                                <i style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }} className="fa-solid fa-copy"></i>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='text-center border border-white py-2'>
                                        <div className='flex justify-center items-center'><span>{"*".repeat(item.password.length)}</span>
                                            <div className='copyicon size-7 cursor-pointer' onClick={() => copyText(item.password)}>
                                                <i style={{ "width": "25px", "height": "25px", "paddingTop": "3px", "paddingLeft": "3px" }} className="fa-solid fa-copy"></i>
                                            </div>
                                        </div>
                                    </td>
                                    <td className='justify-center py-2 border border-white text-center'>
                                        <span className='cursor-pointer mx-2' onClick={() => editPassword(item.id)}>
                                            <i className="fas fa-edit"></i>
                                        </span>
                                        <span className='cursor-pointer mx-2' onClick={() => deletePassword(item.id)}>
                                            <i className="fa-solid fa-trash"></i>
                                        </span>
                                    </td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                    }
                </div>
            </div>
        </>
    )
}

export default Manager