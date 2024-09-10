// @ts-nocheck
import * as React from 'react';
import Error500Page from "../pages/pages/error.500.page.tsx";

class ErrorBoundary extends React.Component<any, any> {

    constructor(props) {
        super(props);
        this.state = {hasError: false};
    }

    componentDidCatch(error, info) {
        this.setState({hasError: true});
        console.error(error);
        console.info(info);
    }

    render() {
        if (this.state.hasError) {
            return <Error500Page />;
        }
        return this.props.children;
    }

}

export default ErrorBoundary;