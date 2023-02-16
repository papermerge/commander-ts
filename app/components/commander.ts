import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking'
import { TrackedArray } from 'tracked-built-ins';


class Node {
    title: string = '';

    constructor(title: string) {
        this.title = title;
    }
}


export default class Commander extends Component {
    @tracked nodes = new TrackedArray<Node>([
        new Node('node1'),
        new Node('node2')
    ]);
}
