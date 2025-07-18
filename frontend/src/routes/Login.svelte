<script lang="ts">
    import {onMount} from "svelte"
    import {navigate} from "svelte-routing"
    import axios from "axios";
    import "../styles/auth.css"
    import {authToken} from "../stores/auth"
    import {login} from "../services/authService"
    import {Button} from "$lib/components/ui/button"
    import { Card, CardContent, CardFooter } from "$lib/components/ui/card";
    import { Label } from "$lib/components/ui/label";
    import { Input } from "$lib/components/ui/input";
    import CardDescription from "$lib/components/ui/card/card-description.svelte";
    import CardTitle from "$lib/components/ui/card/card-title.svelte";
    import WelcomePanel from "$lib/components/auth/WelcomePanel.svelte";
    import { Loader2 } from "lucide-svelte";
    import { isLoading } from "../stores/loading";

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
        if (!formValid) {
            errorMessage = "Please fill in all required fields";
            return;
        }
        
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

<div class="flex h-screen bg-main">  
    <WelcomePanel />
    <div class="border-r border-2 border-border"></div>
    <div class="flex-1 flex items-center justify-center p-6">
        <Card class="w-full max-w-md bg-main">
            <form on:submit|preventDefault={handleLogin} class="p-6">
                <CardTitle>Login to your account</CardTitle>
                <CardDescription class="text-gray-600 mb-6">Enter your details below to login to your account</CardDescription>
                
                
                <div class="space-y-4">
                    <div class="space-y-2">
                        <Label for="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Email adress"
                            bind:value={email}
                            required
                        />
                    </div>
                    
                    <div class="space-y-2">
                        <Label for="password">Password</Label>
                        <Input 
                            id="password" 
                            type="password" 
                            placeholder="Password"
                            bind:value={password} 
                            required 
                        />
                    </div>
                </div>
                
                <Button 
                    type="submit" 
                    class="w-full mt-6  "
                    disabled={!formValid}
                >
                    {#if $isLoading}
                        <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                    {/if}
                    {#if !$isLoading}
                        Login
                    {/if}
                </Button>
                
                <CardDescription class="mt-4 text-center text-sm">
                    Don't have an account? <button on:click={() => navigate("/register")} class="text-bw hover:underline">Sign up</button>
                </CardDescription>
            </form>
        </Card>
    </div>
</div>
