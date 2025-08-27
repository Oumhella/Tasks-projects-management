import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CallbackPage = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();

        const handleCallback = async () => {
            try {
                const code = new URLSearchParams(window.location.search).get('code');
                const errorParam = new URLSearchParams(window.location.search).get('error');

                if (errorParam) {
                    setError(`Authentication error: ${errorParam}`);
                    setLoading(false);
                    return;
                }

                if (!code) {
                    setError('No authorization code received');
                    setLoading(false);
                    return;
                }

                console.log('Exchanging code for token...');
                const response = await fetch('http://localhost:8081/api/v1/auth/token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({ code }),
                    signal: controller.signal,
                });

                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(`Token exchange failed: ${response.status} ${text}`);
                }

                const data = await response.json();
                if (!data.access_token) throw new Error('No access token received');

                localStorage.setItem('access_token', data.access_token);
                if (data.refresh_token) localStorage.setItem('refresh_token', data.refresh_token);
                if (data.expires_in) localStorage.setItem('expires_at', (Date.now() + data.expires_in * 1000).toString());

                navigate('/dashboard');
            } catch (err: any) {
                if (err.name === 'AbortError') return;
                console.error('Callback error', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        handleCallback();
        return () => controller.abort();
    }, [navigate]);

    if (loading)
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">Processing authentication...</p>
                </div>
            </div>
        );

    if (error)
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                    <h2 className="text-xl font-semibold text-red-600 mb-4">Authentication Failed</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => (window.location.href = '/')}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );

    return <p>Redirecting...</p>;
};

export default CallbackPage;
