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

    let email = "";
    let password = "";
    let errorMessage = "";

    // Added validation similar to commented code
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

<div class="flex h-screen bg-blue-500">
    <!-- show separation by using a border in between the two divs -->
    
  
    <div class="flex-1 flex flex-col items-center justify-center text-center p-6">
        <div class="max-w-md">
            <p class="text-sm font-medium mb-2">Welcome to Pictometer</p>
            <h1 class="text-3xl font-bold mb-6">Make your Imagination a reality</h1>
            
            <!-- Character illustration -->
            <div class="flex justify-center mb-6">
                <div class="relative">
                    <div class="w-24 h-24 rounded-full bg-pink-200 flex items-center justify-center">
                        <div class="flex flex-col items-center">
                            <div class="flex space-x-4">
                                <div class="w-1 h-1 rounded-full bg-black"></div>
                                <div class="w-1 h-1 rounded-full bg-black"></div>
                            </div>
                            <div class="w-3 h-1 mt-1 rounded-full bg-black"></div>
                        </div>
                    </div>
                    <div class="absolute bottom-0 right-0 transform translate-x-3 translate-y-1">
                        <div class="relative">
                            <div class="w-6 h-10 bg-white border border-gray-300 rounded-md"></div>
                            <div class="absolute top-1 left-1 w-1 h-1 bg-yellow-300"></div>
                            <div class="absolute top-1 right-1 w-1 h-1 bg-yellow-300"></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <p class="text-sm">
                With this application you can be a World-Class editor using the power of AI. You can upload and image or generate it. Then the fun begins when you get to play around with our AI-Powered photo editor
            </p>
        </div>
    </div>
    <div class="border-r border-2 border-black"></div>
    <!-- Right side with login form -->
    <div class="flex-1 flex items-center justify-center p-6">
        <Card class="w-full max-w-md bg-white">
            <form on:submit|preventDefault={handleLogin} class="p-6">
                <CardTitle>Login to your account</CardTitle>
                <CardDescription class="text-gray-600 mb-6">Enter your details below to login to your account</CardDescription>
                
                {#if errorMessage}
                    <div class="p-3 mb-4 bg-red-100 text-red-700 rounded-md">
                        {errorMessage}
                    </div>
                {/if}
                
                <div class="space-y-4">
                    <!-- Email field -->
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
                    
                    <!-- Password field -->
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
                    class="w-full mt-6 bg-blue-500 hover:bg-blue-600"
                    disabled={!formValid}
                >
                    Login
                </Button>
                
                <CardDescription class="mt-4 text-center text-sm">
                    Don't have an account? <a href="/register" class="text-blue-500 hover:underline">Sign up</a>
                </CardDescription>
            </form>
        </Card>
    </div>
</div>
