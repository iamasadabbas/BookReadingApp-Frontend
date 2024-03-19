const handleSubmit = async (e) => {
    e.preventDefault();
    
        if (!username || !password) {
            setError('Please enter both username and password.');
            return;
        }

        try {
            const config = {
                headers: { 'Content-Type': 'application/json' },
            };
            const response = await axiosInstance.post(`${URL}/user/loginuser`, { username, password }, config);
            console.log(response)


            if (response.data.status === 200) {
                alert('Login successful');
                setLogin(true);
                // const token = Cookies.get('token');
                // if (token) {
                //     console.log(token);
                // } else {
                //     console.log('No token found in cookie');
                // }
                setUsername('')
                setPassword('')
            } else {
                alert('Invalid username or password');
            }
        } catch (error) {
            setError(error);
        }
};
export default handleSubmit;