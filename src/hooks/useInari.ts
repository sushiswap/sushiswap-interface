
import { useCallback, useEffect, useState } from 'react';
import { CurrencyAmount } from '@sushiswap/sdk';
import { ethers } from 'ethers';

import { Fraction } from '../entities';
import useActiveWeb3React from '../hooks/useActiveWeb3React';
import { useInariContract, useSushiContract, useAXSushiContract, useBentoBoxContract, useCrXSushiContract } from '../hooks/useContract';
import { useTransactionAdder } from '../state/transactions/hooks';

import { signMasterContractApproval } from '../entities/KashiCooker';

const { BigNumber } = ethers;

const useInari = () => {
    const { account, library, chainId } = useActiveWeb3React();

    const addTransaction = useTransactionAdder();
    const sushiContract = useSushiContract(true); // withSigner
    const aXSushiContract = useAXSushiContract(true);
    const crXSushiContract = useCrXSushiContract(true);
    const bentoBoxContract = useBentoBoxContract(true);
    const inariContract = useInariContract(true);

    // Allowance Of SUSHI
    const [sushiAllowance, setSushiAllowance] = useState('0');
    const fetchAllowance = useCallback(async () => {
        if (account) {
            try {
                const sushiAllowance = await sushiContract?.allowance(account, inariContract?.address);
                const formatted = Fraction.from(BigNumber.from(sushiAllowance), BigNumber.from(10).pow(18)).toString();
                setSushiAllowance(formatted);
            } catch (error) {
                setSushiAllowance('0');
                throw error;
            }
        }
    }, [account, inariContract?.address, sushiContract]);
    useEffect(() => {
        if (account && inariContract && sushiContract) {
            fetchAllowance();
        }
        const refreshInterval = setInterval(fetchAllowance, 10000);
        return () => clearInterval(refreshInterval);
    }, [account, fetchAllowance, inariContract, sushiContract]);

    // Approve SUSHI
    const approveSushi = useCallback(async () => {
        try {
            const tx = await sushiContract?.approve(inariContract?.address, ethers.constants.MaxUint256.toString());
            return addTransaction(tx, { summary: 'Approve Inari' });
        } catch (e) {
            return e;
        }
    }, [addTransaction, inariContract?.address, sushiContract]);

    // Allowance of aXSUSHI
    const [aXSushiAllowance, setAXSushiAllowance] = useState('0');
    const fetchAXSushiAllowance = useCallback(async () => {
        if (account) {
            try {
                const aXSushiAllowance = await aXSushiContract?.allowance(account, inariContract?.address);
                const formatted = Fraction.from(BigNumber.from(aXSushiAllowance), BigNumber.from(10).pow(18)).toString();
                setAXSushiAllowance(formatted);
            } catch (error) {
                setAXSushiAllowance('0');
                throw error;
            }
        }
    }, [account, inariContract?.address, aXSushiContract]);
    useEffect(() => {
        if (account && inariContract && aXSushiContract) {
            fetchAXSushiAllowance();
        }
        const refreshInterval = setInterval(fetchAXSushiAllowance, 10000);
        return () => clearInterval(refreshInterval);
    }, [account, fetchAXSushiAllowance, inariContract, aXSushiContract]);

    // Approve aXSUSHI
    const approveAXSushi = useCallback(async () => {
        try {
            const tx = await aXSushiContract?.approve(inariContract?.address, ethers.constants.MaxUint256.toString());
            return addTransaction(tx, { summary: 'Approve Inari' });
        } catch (e) {
            return e;
        }
    }, [addTransaction, inariContract?.address, aXSushiContract]);

    // Allowance of Bento
    const [bentoAllowance, setBentoAllowance] = useState(false);
    const fetchBentoAllowance = useCallback(async () => {
        if (account) {
            try {
                const bentoAllowance = await bentoBoxContract?.masterContractApproved(inariContract?.address, account);
                setBentoAllowance(bentoAllowance);
            } catch (error) {
                setBentoAllowance(false);
                throw error;
            }
        }
    }, [account, inariContract?.address, bentoBoxContract]);
    useEffect(() => {
        if (account && inariContract && bentoBoxContract) {
            fetchBentoAllowance();
        }
        const refreshInterval = setInterval(fetchBentoAllowance, 10000);
        return () => clearInterval(refreshInterval);
    }, [account, fetchBentoAllowance, inariContract, bentoBoxContract]);

    // Approve Bento
    const approveBento = useCallback(async () => {
        if (!account) {
            console.error('no account');
            return false;
        }
        if (!library) {
            console.error('no library');
            return false;
        }
        
        try {
            const signature = await signMasterContractApproval(
                bentoBoxContract,
                inariContract?.address,
                account,
                library,
                true,
                chainId
            );
            const { v, r, s } = ethers.utils.splitSignature(signature);
            const tx = await bentoBoxContract?.setMasterContractApproval(
                account,
                inariContract?.address,
                true,
                v,
                r,
                s
            );
            return addTransaction(tx, { summary: 'Approve Inari' });
        } catch (e) {
            return e;
        }
    }, [addTransaction, inariContract?.address, bentoBoxContract, account]);

    // Allowance of crXSUSHI
    const [crXSushiAllowance, setCrXSushiAllowance] = useState('0');
    const fetchCrXSushiAllowance = useCallback(async () => {
        if (account) {
            try {
                const crXSushiAllowance = await crXSushiContract?.allowance(account, inariContract?.address);
                const formatted = Fraction.from(BigNumber.from(crXSushiAllowance), BigNumber.from(10).pow(18)).toString();
                setCrXSushiAllowance(formatted);
            } catch (error) {
                setCrXSushiAllowance('0');
                throw error;
            }
        }
    }, [account, inariContract?.address, crXSushiContract]);
    useEffect(() => {
        if (account && inariContract && crXSushiContract) {
            fetchCrXSushiAllowance();
        }
        const refreshInterval = setInterval(fetchCrXSushiAllowance, 10000);
        return () => clearInterval(refreshInterval);
    }, [account, fetchCrXSushiAllowance, inariContract, crXSushiContract]);

    // Approve crXSUSHI
    const approveCrXSushi = useCallback(async () => {
        try {
            const tx = await crXSushiContract?.approve(inariContract?.address, ethers.constants.MaxUint256.toString());
            return addTransaction(tx, { summary: 'Approve Inari' });
        } catch (e) {
            return e;
        }
    }, [addTransaction, inariContract?.address, crXSushiContract]);

    // Stake SUSHI → xSUSHI → AAVE
    const stakeSushiToAave = useCallback(
        async (amount: CurrencyAmount | undefined) => {
            if (amount?.raw) {
                try {
                    const tx = await inariContract?.stakeSushiToAave(account, amount?.raw.toString());
                    return addTransaction(tx, { summary: 'SUSHI → xSUSHI → AAVE' });
                } catch (e) {
                    return e;
                }
            }
        },
        [account, addTransaction, inariContract]
    );

    // Unstake AAVE → xSUSHI → SUSHI
    const unstakeSushiFromAave = useCallback(
        async (amount: CurrencyAmount | undefined) => {
            if (amount?.raw) {
                try {
                    const tx = await inariContract?.unstakeSushiFromAave(account, amount?.raw.toString());
                    return addTransaction(tx, { summary: 'AAVE → xSUSHI → SUSHI' });
                } catch (e) {
                    return e;
                }
            }
        },
        [account, addTransaction, inariContract]
    );

    // Stake SUSHI → xSUSHI → BENTO
    const stakeSushiToBento = useCallback(
        async (amount: CurrencyAmount | undefined) => {
            if (amount?.raw) {
                try {
                    const tx = await inariContract?.stakeSushiToBento(account, amount?.raw.toString());
                    return addTransaction(tx, { summary: 'SUSHI → xSUSHI → BENTO' });
                } catch (e) {
                    return e;
                }
            }
        },
        [account, addTransaction, inariContract]
    );

    // Unstake BENTO → xSUSHI → SUSHI
    const unstakeSushiFromBento = useCallback(
        async (amount: CurrencyAmount | undefined) => {
            if (amount?.raw) {
                try {
                    const tx = await inariContract?.unstakeSushiFromBento(account, amount?.raw.toString());
                    return addTransaction(tx, { summary: 'BENTO → xSUSHI → SUSHI' });
                } catch (e) {
                    return e;
                }
            }
        },
        [account, addTransaction, inariContract]
    );

    // Stake SUSHI → xSUSHI → CREAM → BENTO
    const stakeSushiToCreamToBento = useCallback(
        async (amount: CurrencyAmount | undefined) => {
            if (amount?.raw) {
                try {
                    const tx = await inariContract?.stakeSushiToCreamToBento(account, amount?.raw.toString());
                    return addTransaction(tx, { summary: 'SUSHI → xSUSHI → CREAM → BENTO' });
                } catch (e) {
                    return e;
                }
            }
        },
        [account, addTransaction, inariContract]
    );

    // Unstake BENTO → CREAM → xSUSHI → SUSHI
    const unstakeSushiFromCreamFromBento = useCallback(
        async (amount: CurrencyAmount | undefined) => {
            if (amount?.raw) {
                try {
                    const tx = await inariContract?.unstakeSushiFromCreamFromBento(account, amount?.raw.toString());
                    return addTransaction(tx, { summary: 'BENTO → CREAM → xSUSHI → SUSHI' });
                } catch (e) {
                    return e;
                }
            }
        },
        [account, addTransaction, inariContract]
    );

    // Stake SUSHI → xSUSHI → CREAM
    const stakeSushiToCream = useCallback(
        async (amount: CurrencyAmount | undefined) => {
            if (amount?.raw) {
                try {
                    const tx = await inariContract?.stakeSushiToCream(account, amount?.raw.toString());
                    return addTransaction(tx, { summary: 'SUSHI → xSUSHI → CREAM' });
                } catch (e) {
                    return e;
                }
            }
        },
        [account, addTransaction, inariContract]
    );

    // Unstake CREAM → xSUSHI → SUSHI
    const unstakeSushiFromCream = useCallback(
        async (amount: CurrencyAmount | undefined) => {
            if (amount?.raw) {
                try {
                    const tx = await inariContract?.unstakeSushiFromCream(account, amount?.raw.toString());
                    return addTransaction(tx, { summary: 'CREAM → xSUSHI → SUSHI' });
                } catch (e) {
                    return e;
                }
            }
        },
        [account, addTransaction, inariContract]
    );

    return { 
        INARI_ADDRESS: inariContract?.address,
        sushiAllowance, approveSushi, aXSushiAllowance, approveAXSushi, bentoAllowance, approveBento, crXSushiAllowance, approveCrXSushi,
        stakeSushiToAave, unstakeSushiFromAave, stakeSushiToBento, unstakeSushiFromBento,
        stakeSushiToCreamToBento, unstakeSushiFromCreamFromBento, stakeSushiToCream, unstakeSushiFromCream 
    };
}

export default useInari;