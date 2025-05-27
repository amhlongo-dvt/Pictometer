<script lang="ts">
    import {onMount} from "svelte"
    import {navigate} from "svelte-routing"
    import axios from "axios";
    import "../styles/auth.css"
    import {authToken} from "../stores/auth"
    import {API_HOST} from "../constants"

    let name = "";
    let email = "";
    let password = "";
    let errorMessage = "";

    $: formValid = name.length > 0 && email.length > 0 && password.length > 0;

    onMount(() => {
        if ($authToken) {
            navigate("/")
        }
    });

    async function register() {
        try {
            const response = await axios.post(`${API_HOST}/api/v1/auth/register/`, {
                email,
                password,
                name
            });
            navigate("/login")
        } catch (error) {
            const defaultError = "An unexpected error occurred"
            if (axios.isAxiosError(error) && error.response){
                const errorSlug = error?.response?.data?.error
                switch (errorSlug) {
                    case "ERROR_USER_ALREADY_EXISTS":
                        errorMessage = "User already exists, try logging in"
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
    <form on:submit|preventDefault={register} class="auth-form">
        <div class="form-header">
            <h2>Register</h2>
        </div>
        {#if errorMessage}
            <p class="error">{errorMessage}</p>
        {/if}

        <div class="input-group">
            <input 
                type="text" 
                bind:value={name} 
                placeholder="Name" 
                required 
            />
        </div>
        
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
                Register
            </button>
        </div>

        <div class="switch-auth">
            Already have an account?
            <a href="/login">Login here</a>
        </div>
        
    </form>
</div>