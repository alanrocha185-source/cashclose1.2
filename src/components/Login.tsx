import React, { useState } from 'react';
import { Wallet } from 'lucide-react';

type Props = {
    onLogin: (role: 'admin' | 'staff') => void;
};

export const Login: React.FC<Props> = ({ onLogin }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = () => {
        if (password === 'Alan2512!') {
            onLogin('admin');
        } else if (password === 'venda') {
            onLogin('staff');
        } else {
            setError('Senha inválida');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-indigo-900">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
                <div className="flex flex-col items-center mb-6">
                    <Wallet className="w-10 h-10 text-indigo-600 mb-2" />
                    <h1 className="text-xl font-bold">CashClose Pro</h1>
                </div>

                <input
                    type="password"
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        setError('');
                    }}
                    className="w-full border rounded px-4 py-3 mb-3"
                />

                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                <button
                    onClick={handleLogin}
                    className="w-full bg-indigo-600 text-white py-3 rounded font-bold"
                >
                    Entrar
                </button>
            </div>
        </div>
    );
};
