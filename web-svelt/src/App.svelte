<script lang="ts">
    import {Router, Link, Route, navigate} from "svelte-routing";
    import Home from "./routes/Home.svelte";
    import About from "./routes/About.svelte";
    import ProductList from "./routes/product/ProductList.svelte";
    import Product from "./routes/product/Product.svelte";
    import ProductModify from "./routes/product/ProductModify.svelte";
    import ProductRegister from "./routes/product/ProductRegister.svelte";
    import Login from "./routes/auth/Login.svelte";
    import { accessToken, refreshToken, serverProgress } from "./store";
    import messageModule from "./module/swalConfig";
    import { faUser, faSignOutAlt, faAddressCard, faCartShopping, faRectangleList } from '@fortawesome/free-solid-svg-icons';
    import Icon from 'svelte-awesome';
    import Tooltip from "./components/Tooltip/Tooltip.svelte";
    import { commonModule } from "./module/commonModule";
    import BasketList from "./routes/basket/BasketList.svelte";
    import ProgressLinear from "./components/ProgressLinear/ProgressLinear.svelte";
    import PaymentList from "./routes/payment/paymentList.svelte";
    import Signup from "./routes/auth/signup.svelte";
    import UserInfo from "./routes/auth/userInfo.svelte";
    

    const logout = () => {
        messageModule.confirm('Are you sure you want to logout?', (result: boolean) => {
            if (!result) return;

            accessToken.set(null);
            refreshToken.set(null);
            commonModule.increaseProgress(1, 'server');
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
                            <button type="button" class="text-white hover:text-gray-300 flex items-center" on:click={() => {navigate('/payment')}}>
                                <Icon data={faRectangleList} scale={1.5} class="mr-2"/>
                                <span class="sr-only">Payment List</span>
                            </button>
                        </div>
                        <div class="bg-white rounded-lg shadow-md p-3">
                            <div class="text-sm font-bold text-gray-900 mb-2">Payment List</div>
                        </div>
                    </Tooltip>
                    <Tooltip>
                        <div slot="activator">
                            <button type="button" class="text-white hover:text-gray-300 flex items-center" on:click={() => {navigate('/basket')}}>
                                <Icon data={faCartShopping} scale={1.5} class="mr-2"/>
                                <span class="sr-only">Cart List</span>
                            </button>
                        </div>
                        <div class="bg-white rounded-lg shadow-md p-3">
                            <div class="text-sm font-bold text-gray-900 mb-2">Cart List</div>
                        </div>
                    </Tooltip>
                    <Tooltip>
                        <div slot="activator">
                            <button type="button" class="text-white hover:text-gray-300 flex items-center" on:click={() => navigate('/auth/info')}>
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
        <Route path='/auth/signup' component={Signup}/>
        <Route path='auth/info' component={UserInfo}/>
        <Route path='/product' component={ProductList}/>
        <Route path='/product/:id' let:params>
            <Product id={+params.id}/>
        </Route>
        <Route path='/product/:id/modify' let:params>
            <ProductModify id={+params.id}/>
        </Route>
        <Route path='/product/register' component={ProductRegister}/>
        <Route path='/basket' component={BasketList}/>
        <Route path='/payment' component={PaymentList}/>
    </main>
</Router>

<!--server loading without page load-->
{#if $serverProgress}
    <div class="overlay flex-col">
        <h2 class="text-center text-4xl font-bold mb-4">{$serverProgress}%</h2>
        <ProgressLinear app={true} color="indigo" progress={$serverProgress}/>
    </div>
{/if}

<style>
    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
</style>