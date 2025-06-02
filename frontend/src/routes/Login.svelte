<script lang="ts">
    import {onMount} from "svelte"
    import {navigate} from "svelte-routing"
    import axios from "axios";
    import "../styles/auth.css"
    import {authToken} from "../stores/auth"
    import {login} from "../services/authService"

    let email = "";
    let password = "";
    let errorMessage = "";

    $: formValid = email.length > 0 && password.length > 0;

    onMount(() => {
        if ($authToken) {
            navigate("/")
        }
    });

    async function handleLogin() {
        try {
            const response = await login({
                email,
                password,
            });
            authToken.set(response.token);
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
    <form on:submit|preventDefault={handleLogin} class="auth-form">
        <div class="form-header">
            <h2>Login</h2>
        </div>
        {#if errorMessage}
            <p class="error">{errorMessage}</p>
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
            <span>Don't have an account?</span>
            <a href="/register">Register here</a>
        </div>
    </form>
</div>

