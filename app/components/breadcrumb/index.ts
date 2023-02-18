import Component from '@glimmer/component';
import { trackedFunction } from 'ember-resources/util/function';


interface Args {
    endpoint: string;
    onClick: (item: string) => void;
}


export default class Breadcrumb extends Component<Args> {

    data = trackedFunction(this, async() => {
        let response = await fetch(`http://127.0.0.1:8000/api/folders/${this.args.endpoint}/`,
            {
                headers: {
                    'Authorization': 'Token 0c724ad3d4101ba0b602c7fff44f4ff60c39e07d533c7eb7175c1b6d2efb47e3'
                }
            }
        );
        let json = await response.json();

        return json.data;
    });

    get nodes() {
        return this.data.value?? [];
    }
}
