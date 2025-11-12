function withClass(...args: any[]){
    return args.filter(Boolean).join(' ');
}

export default withClass