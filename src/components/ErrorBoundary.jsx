import { Component } from 'react';

export default class ErrorBoundary extends Component {
    state = { hasError: false, error: null }

    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }

    render() {
        if (this.state.hasError) return (
            <div className="h-screen grid place-items-center">
                <div className="max-w-lg p-3 flex flex-col items-center text-center space-y-4">
                    <h1 className="text-gray-600 text-2xl">An error occured...</h1>
                    <p className="text-red-500">{this.state.error?.message}</p>
                </div>
            </div>
        )

        return this.props.children
    }
}
