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
    import { faUser, faSignOutAlt, faAddressCard, faBasketShopping } from '@fortawesome/free-solid-svg-icons';
    import Icon from 'svelte-awesome';
    import Tooltip from "./components/Tooltip/Tooltip.svelte";
    import { commonModule } from "./module/commonModule";
    import BasketList from "./routes/basket/BasketList.svelte";
    

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

    $: userInfo = $accessToken ? (commonModule.decodeJwtToken($accessToken) as any) : null;
    $: username = userInfo ? userInfo.username : null;
    $: userAuth = userInfo ? userInfo.auth : null;
</script>

<Router>
    <nav class="bg-gray-800 p-4">
        <div class="container mx-auto flex justify-between items-center">
            <ul class="flex space-x-4">
                <li>
                    <Link to="/" class="text-white hover:text-gray-300">Home</Link>
                </li>
                <li>
                    <Link to="/about" class="text-white hover:text-gray-300">About</Link>
                </li>
                <li>
                    <Link to="/product" class="text-white hover:text-gray-300">Product</Link>
                </li>
            </ul>
            <div class="flex items-center gap-5">
                {#if $accessToken}
                    <Tooltip>
                        <div slot="activator">
                            <button type="button" class="text-white hover:text-gray-300 flex items-center" on:click={() => {navigate('/basket')}}>
                                <Icon data={faBasketShopping} scale={1.5} class="mr-2"/>
                                <span class="sr-only">Basket List</span>
                            </button>
                        </div>
                        <div class="bg-white rounded-lg shadow-md p-3">
                            <div class="text-sm font-bold text-gray-900 mb-2">Basket List</div>
                        </div>
                    </Tooltip>
                    <Tooltip>
                        <div slot="activator">
                            <button type="button" class="text-white hover:text-gray-300 flex items-center">
                                <Icon data={faAddressCard} scale={1.5} class="mr-2"/>
                                <span class="sr-only">User Info</span>
                            </button>
                        </div>
                        <div class="bg-white rounded-lg shadow-md p-4 w-48">
                            <div class="text-sm font-bold text-gray-900 mb-2">User Info</div>
                            <div class="space-y-1">
                                <p class="text-xs text-gray-600">
                                    <span class="font-semibold">User ID:</span> 
                                    <span>{username}</span>
                                </p>
                                <p class="text-xs text-gray-600">
                                    <span class="font-semibold">Authorization:</span> 
                                    <span>{userAuth}</span>
                                </p>
                            </div>
                        </div>
                    </Tooltip>
                    <Tooltip>
                        <div slot="activator">
                            <button type="button" class="text-white hover:text-gray-300 flex items-center" on:click={logout}>
                                <Icon data={faSignOutAlt} scale={1.5} class="mr-2"/>
                                <span class="sr-only">Logout</span>
                            </button>
                        </div>
                        <div class="bg-white rounded-lg shadow-md p-3">
                            <div class="text-sm font-bold text-gray-900 mb-2">Logout</div>
                        </div>
                    </Tooltip>
                {:else}
                    <Tooltip>
                        <div slot="activator">
                            <Link to="/login" class="text-white hover:text-gray-300 flex items-center">
                                <Icon data={faUser} scale={1.5} class="mr-2"/>
                                <span class="sr-only">Login</span>
                            </Link>
                        </div>
                        <div class="bg-white rounded-lg shadow-md p-3">
                            <div class="text-sm font-bold text-gray-900 mb-2">Login</div>
                        </div>
                    </Tooltip>
                {/if}
            </div>
        </div>
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
        <Route path='/basket' component={BasketList}/>
    </main>
</Router>