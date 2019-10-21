import * as vscode from 'vscode';
import * as _ from 'lodash';
import * as path from 'path';
class ServiceManagerExecuteFile {
    env: any;

    constructor(env: any) {
        this.env = env;
    }

    /**
     *
     *
     * @param {*} file
     */
    async run(fileName: any) {
        let libraryName = path.basename(fileName, '.js');
        let result = null;

        vscode.window.setStatusBarMessage(`Sending execute request...`, 5000);

        result = await this.env.sendRequest({
            url: this.env.config.url + this.env.config.resourceCollection + '/' + libraryName+'/action/executelibrary',
            method:'post',
            body: {}
        });        

        if (result) {
            if (result.body) {                
                if (result.body.ReturnCode == 0 && result.body.Messages.length == 0) {
                    vscode.window.showInformationMessage('Script Library executed successfully.');
                } else if (result.body.ReturnCode == 0 && result.body.Messages.length > 0) {
                    vscode.window.showInformationMessage(result.body.Messages.join(""));
                } else {
                    vscode.workspace
                        .openTextDocument({ content: result.body.Messages.join("\n")})
                        .then(document => vscode.window.showTextDocument(document, {'preview': true}));
                }
            }
        }
    }

}

export default ServiceManagerExecuteFile;