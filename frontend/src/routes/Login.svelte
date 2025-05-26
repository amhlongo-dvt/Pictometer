<script>
    import {onMount} from "svelte"
    import {navigate} from "svelte-routing"
    import axios from "axios";
    import {authToken} from "../stores/auth"
    import {API_HOST} from "../constants"

    let email = "";
    let password = "";
    let errorMessage = "";

    $: formValid = email.length > 0 && password.length > 0;

    onMount(() => {
        if ($authToken) {
            navigate("/")
        }
    });

    async function login() {
        try {
            const response = await axios.post(`${API_HOST}/api/v1/auth/login/`, {
                email,
                password,
            });
            authToken.set(response.data?.token);
            navigate("/")
        } catch (error) {
            const defaultError = "An unexpected error occurred"
            if (axios.isAxiosError(error) && error.response){
                const errorSlug = error?.response?.data?.error
                switch (errorSlug) {
                    case "INVALID_CREDENTIALS":
                        errorMessage = "Invalid email or password"
                        break;
                    default:
                        errorMessage = defaultError
                        break;
                }
            }else{
                errorMessage = defaultError
            }
        }
    }
</script>

<div class="auth-container">
    <form on:submit|preventDefault={login} class="auth-form">
        <div class="form-header">
            <h2>Login</h2>
        </div>
        {#if errorMessage}
            <p class="error-message">{errorMessage}</p>
        {/if}
        <div class="input-group">
            <input 
                type="email" 
                bind:value={email} 
                placeholder="Email" 
                required 
            />
        </div>

        <div class="input-group">
            <input 
                type="password" 
                bind:value={password} 
                placeholder="Password"
                required 
            />
        </div>

        <div class="action-group">
            <button
                class="auth-btn"
                type="submit" 
                disabled={!formValid}
            >
                Login
            </button>
        </div>

        <div class="switch-auth">
            Don't have an account?
            <a href="/register">Register here</a>
        </div>
    </form>
</div>

