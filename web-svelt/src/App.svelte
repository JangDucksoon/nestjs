<script lang="ts">
    import {Router, Link, Route, navigate} from "svelte-routing";
    import Home from "./routes/Home.svelte";
    import About from "./routes/About.svelte";
    import ProductList from "./routes/product/ProductList.svelte";
    import Product from "./routes/product/Product.svelte";
    import ProductModify from "./routes/product/ProductModify.svelte";
    import ProductRegister from "./routes/product/ProductRegister.svelte";
    import Login from "./routes/auth/Login.svelte";
    import { accessToken, refreshToken } from "./store";
    import messageModule from "./module/swalConfig";

    const logout = () => {
        messageModule.confirm('Are you sure you want to logout?', (result: boolean) => {
            if (!result) return;

            accessToken.set(null);
            refreshToken.set(null);

            if (location.href.includes('/product')) {
                navigate('/');
            }
        });
    }
</script>

<Router>
    <nav class="bg-gray-800 p-4">
    <ul class="flex space-x-4">
        <li>
            <Link to="/" class="text-white hover:text-gray-300">Home</Link>
        </li>
        <li>
            <Link to="/about" class="text-white hover:text-gray-300">About</Link>
        </li>
        {#if $accessToken}
            <li>
                <button type="button" class="text-white hover:text-gray-300" on:click={logout}>Logout</button>
            </li>
        {:else}
            <li>
                <Link to="/login" class="text-white hover:text-gray-300">Login</Link>
            </li>
        {/if}
        <li>
            <Link to="/product" class="text-white hover:text-gray-300">Product</Link>
        </li>
    </ul>
    </nav>

    <main class="container mx-auto mt-8">
        <Route path='/' component={Home}/>
        <Route path='/about' component={About}/>
        <Route path='/login' component={Login}/>
        <Route path='/product' component={ProductList}/>
        <Route path='/product/:id' let:params>
            <Product id={+params.id}/>
        </Route>
        <Route path='/product/:id/modify' let:params>
            <ProductModify id={+params.id}/>
        </Route>
        <Route path='/product/register' component={ProductRegister}/>
    </main>
</Router>