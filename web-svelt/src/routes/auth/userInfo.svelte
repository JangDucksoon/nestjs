<script lang="ts">
    import { navigate } from "svelte-routing";
    import TextField from "../../components/TextField/TextField.svelte";
    import { axiosInstance } from "../../module/axiosConfig";
    import messageModule from "../../module/swalConfig";
    import { accessToken, progress } from "../../store";
    import { commonModule } from "../../module/commonModule";
    import ProgressLinear from "../../components/ProgressLinear/ProgressLinear.svelte";
    import { onDestroy, onMount } from "svelte";
    import { faShield, faUser, faIdCard, faUserCheck, faKey } from "@fortawesome/free-solid-svg-icons";
    import Icon from "svelte-awesome";
    import PasswordModal from "./passwordModal.svelte";

    let id: string;
    let username: string;
    let newUsername: string;
    let newPassword: string;
    let authorization: string;
    let modify_mode: boolean = false;
    let nameCheck: boolean = false;

    //팝업 관련 variables
    let show: boolean = false;

    const getUser = async () => {
        commonModule.increaseProgress(0.1)
        let userId: string = '';
        
        await commonModule.verifyToken(() => {
            userId = (commonModule.decodeJwtToken($accessToken) as any)?.username;
        });

        if (!userId) {
            messageModule.alert('please login first', () => {
                navigate('/login');
            });
        }

        const res = await axiosInstance.get<Record<string, any>>(`/auth/${userId}`);

        if (res?.status === 200) {
            if ((res.data as any) === '') {
                messageModule.alert('User not found');
                navigate('/login');
                return;
            }

            id = res.data.id;
            username = res.data.username;
            newUsername = username;
            authorization = res.data.auth;
        }
    }

    const checkDuplicateUsername = async () => {
        if (!newUsername) return;

        const res = await axiosInstance.get<any>(`/auth/${newUsername}`);

        if (res?.status === 200) {
            if (res.data === '') {
                messageModule.alert('You can use this username.', () => {nameCheck = true});
            } else {
                messageModule.alert('Username already exists.', () => {nameCheck = false}, 'warning');
                
            }
        }
    }

    const updateUserInfo = (obj: any) => {
        let password: string = '';

        if (!obj?.detail?.password) {
            messageModule.alert('Please enter a password', null, 'warning');
            return;
        } else {
            password = obj.detail.password;
        }

        messageModule.confirm('Are you sure you want to update your information?', async (result: boolean) => {
            if (!result) return;

            let updateUserInfo = {
                id,
                username: '',
                hashedPassword: ''
            };

            if (username !== newUsername) {
                if (!nameCheck) {
                    messageModule.alert('Please check the username', null, 'warning');
                    return;
                }
                
                updateUserInfo.username = newUsername;
            }

            if (newPassword) {
                updateUserInfo.hashedPassword = newPassword
            }
        });
    }

    const openPasswordModal = () => {
        if (username === newUsername && !newPassword) {
            messageModule.alert('No changes detected', null, 'info');
            return;
        }

        show = true;
    }

    onMount(getUser);
    onDestroy(() => commonModule.destroyProgress());

    $: if (!modify_mode) {
        newUsername = username;
        newPassword = '';
    }

    $: {
        newUsername
        nameCheck = false;
    }

    $: if (!$accessToken) {
        navigate('/');
    }
</script>

{#if $progress}
    <p class="text-center text-4xl font-bold mb-4">{$progress}%</p>
    <ProgressLinear app={true} color="indigo" progress={$progress}/>
{:else if !modify_mode}
    <div class="flex items-center justify-center min-h-[700px]">
        <div class="w-full max-w-lg px-4">
            <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg overflow-hidden">
                <div class="px-6 py-8">
                    <h2 class="text-3xl font-bold text-white mb-4 text-center">User Info</h2>
                    <div class="space-y-4">
                        <div class="flex items-center bg-white bg-opacity-20 rounded-lg p-3">
                            <Icon data={faIdCard} class="text-white mr-3" scale={1.5}/>
                            <div>
                                <p class="text-sm font-medium text-white opacity-70">User Id</p>
                                <p class="text-lg font-semibold text-white">{id}</p>
                            </div>
                        </div>
                        <div class="flex items-center bg-white bg-opacity-20 rounded-lg p-3">
                            <Icon data={faUser} class="text-white mr-3" scale={1.5}/>
                            <div>
                                <p class="text-sm font-medium text-white opacity-70">User Name</p>
                                <p class="text-lg font-semibold text-white">{username}</p>
                            </div>
                        </div>
                        <div class="flex items-center bg-white bg-opacity-20 rounded-lg p-3">
                            <Icon data={faShield} class="text-white mr-3" scale={1.5}/>
                            <div>
                                <p class="text-sm font-medium text-white opacity-70">Authorization</p>
                                <p class="text-lg font-semibold text-white">{authorization}</p>
                            </div>
                        </div>
                        <button class="btn-orange w-full" on:click={() => modify_mode = true}>Modify User Information</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
{:else if modify_mode}
    <div class="flex items-center justify-center min-h-[800px]">
        <div class="w-full max-w-lg px-4">
            <div class="bg-gradient-to-r from-blue-500 to-gray-600 rounded-lg shadow-lg overflow-hidden">
                <div class="px-6 py-8">
                    <h2 class="text-3xl font-bold text-white mb-4 text-center">User Info</h2>
                    <div class="space-y-4">
                        <div class="flex items-center bg-white bg-opacity-20 rounded-lg p-3">
                            <Icon data={faIdCard} class="text-white mr-3" scale={1.5}/>
                            <div>
                                <p class="text-sm font-medium text-white opacity-70">User Id</p>
                                <p class="text-lg font-semibold text-white">{id}</p>
                            </div>
                        </div>
                        <div class="flex items-center bg-white bg-opacity-20 rounded-lg p-3">
                            <Icon data={faUser} class="text-white mr-3" scale={1.5}/>
                            <div>
                                <p class="text-sm font-medium text-white opacity-70">User Name</p>
                                <TextField outlined bind:value={newUsername} hint="Please enter the new user name" on:input={commonModule.filterHangleAndSpace}/>
                            </div>
                            <button class="ml-10 hover:scale-150 disabled:opacity-50" disabled={nameCheck} on:click={checkDuplicateUsername}>
                                <Icon data={faUserCheck} class="text-white mr-3" scale={1.5}/>
                            </button>
                        </div>
                        <div class="flex items-center bg-white bg-opacity-20 rounded-lg p-3">
                            <Icon data={faKey} class="text-white mr-3" scale={1.5}/>
                            <div>
                                <p class="text-sm font-medium text-white opacity-70">Password</p>
                                <TextField outlined bind:value={newPassword} hint="Please enter the new password" type="password" on:input={commonModule.filterHangleAndSpace}/>
                            </div>
                        </div>
                        <div class="flex items-center bg-white bg-opacity-20 rounded-lg p-3">
                            <Icon data={faShield} class="text-white mr-3" scale={1.5}/>
                            <div>
                                <p class="text-sm font-medium text-white opacity-70">Authorization</p>
                                <p class="text-lg font-semibold text-white">{authorization}</p>
                            </div>
                        </div>
                        <button class="btn-cyan w-full" on:click={openPasswordModal}>Modify Information</button>
                        <button class="btn-orange w-full" on:click={() => modify_mode = false}>User Information</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <PasswordModal bind:show={show} on:sendPassword={updateUserInfo}/>
{/if}