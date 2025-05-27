<script lang="ts">
    import {navigate} from "svelte-routing"
    import "../styles/header.css"
    import {authToken} from '../stores/auth'
    const name = authToken.getPayload()?.name || "User"
    
    function logout() {
        authToken.remove()
        navigate("/login")
    }
</script>

<div class="header">
    <div class="user-name">{name}</div>
    <button class="logout-button" on:click={logout}>
        Logout
    </button>
</div>