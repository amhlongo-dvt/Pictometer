<script>
  import "./app.css";
  import {Route, Router} from 'svelte-routing';
  import Register from './routes/Register.svelte';
  import Login from './routes/Login.svelte';
  import Chat from './routes/Chat.svelte';
  import CreateImage from "./routes/CreateImage.svelte";
  import EditImage from "./routes/EditImage.svelte";
</script>

<Router>
  <Route path="/register" component={Register}/>
  <Route path="/login" component={Login}/>
  <Route>
    <Chat chatId = {null}/>
  </Route>
<Route path="/:id" let:params>
    <Chat chatId={params.id}/>
  </Route>
  <Route path="/create/:chatId" let:params>
    <CreateImage chatId={params.chatId}/>
  </Route>
  <Route path="/edit/:chatId/:imageId" let:params>
    <EditImage imageId={params.imageId} chatId={params.chatId}/>
  </Route>
</Router>
