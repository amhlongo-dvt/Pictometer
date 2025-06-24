<script lang="ts">
    import {onMount} from "svelte"
    import {navigate} from "svelte-routing"
    import axios from "axios";
    import "../styles/auth.css"
    import {authToken} from "../stores/auth"
    import {register} from "../services/authService"
    import {Button} from "$lib/components/ui/button"
    import { Card, CardContent, CardFooter } from "$lib/components/ui/card";
    import { Label } from "$lib/components/ui/label";
    import { Input } from "$lib/components/ui/input";
    import CardDescription from "$lib/components/ui/card/card-description.svelte";
    import CardTitle from "$lib/components/ui/card/card-title.svelte";
    import WelcomePanel from "$lib/components/auth/WelcomePanel.svelte";
    import { toast } from "svelte-sonner";
    import { isLoading } from "../stores/loading";
    import { Loader2 } from "lucide-svelte";

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

    async function handleRegister() {
        if (!formValid) {
            errorMessage = "Please fill in all required fields";
            return;
        }
        
        try {
            await register({
                email,
                password,
                name
            });
            toast.success("User registered successfully");
            navigate("/login")
        } catch (error) {
            const defaultError = "An unexpected error occurred"
            if (axios.isAxiosError(error) && error.response){
                const errorSlug = error?.response?.data?.error
                console.log(error)
                switch (errorSlug) {
                    case "USER_ALREADY_EXIST":
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
    
<div class="flex h-screen bg-main">  
    <WelcomePanel />
    <div class="border-r border-2 border-border"></div>
    <div class="flex-1 flex items-center justify-center p-6">
        <Card class="w-full max-w-md bg-main">
            <form on:submit|preventDefault={handleRegister} class="p-6">
                <CardTitle>Sign Up to your account</CardTitle>
                <CardDescription class="text-gray-600 mb-6">Enter your details below to sign up to your account</CardDescription>

                
                <div class="space-y-4">
                    <div class="space-y-2">
                        <Label for="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Name"
                            bind:value={name}
                            required
                        />
                    </div>
                    
                    <div class="space-y-2">
                        <Label for="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Email address"
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
                    class="w-full mt-6 "
                    disabled={!formValid}
                >
                    {#if $isLoading}
                        <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                    {/if}
                    {#if !$isLoading}
                        Sign Up
                    {/if}
                </Button>
                
                <CardDescription class="mt-4 text-center text-sm">
                    Already have an account? <button on:click={() => navigate("/login")} class="text-bw hover:underline">Log in</button>
                </CardDescription>
            </form>
        </Card>
    </div>
</div>