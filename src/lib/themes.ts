
    export type Theme = 'root'|'dark'|'dark3'


    export const themes : {
    name: Theme;
    values: {
        name: string;
        value: string;
    }[];
}[] = [{"name":"root","values":[{"name":"--background","value":"0 0% 100%"}]},{"name":"dark","values":[{"name":"--background","value":"224 71.4% 4.1%"}]},{"name":"dark3","values":[{"name":"--background","value":"20 14.3% 4.1%"},{"name":"--foreground","value":"60 9.1% 97.8%"},{"name":"--primary","value":"47.9 95.8% 53.1%"},{"name":"--secondary","value":"12 6.5% 15.1%"},{"name":"--secondary-foreground","value":"60 9.1% 97.8%"}]}]


    export const themeList = ['root','dark','dark3']
