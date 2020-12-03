import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import * as go from 'gojs';
import { DataSyncService} from 'gojs-angular';
import { DiagramComponent} from 'gojs-angular';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  @ViewChild('myDiagram', { static: true }) public myDiagramComponent: DiagramComponent;
  title = 'GoJs-practice';
  public initDiagram(): go.Diagram {

    const $ = go.GraphObject.make;
    const dia = $(go.Diagram, {
      'undoManager.isEnabled': true, // must be set to allow for model change listening
      // 'undoManager.maxHistoryLength': 0,  // uncomment disable undo/redo functionality
      model: $(go.GraphLinksModel,
        {
          linkKeyProperty: 'key' // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
        }
      )
    });
  
    // define the Node template
    dia.nodeTemplate =
      $(go.Node, 'Auto',
        {
          toLinkable: true, fromLinkable: true
        },
        $(go.Shape, 'RoundedRectangle', { stroke: null },
          new go.Binding('fill', 'color')
        ),
        $(go.TextBlock, { margin: 8 },
          new go.Binding('text', 'key'))
      );
  
    return dia;
  }
  
  public diagramNodeData: Array<any> = [
    { key: 'Node1', color: 'yellow' },
    { key: 'Node 2', color: 'orange' },
    { key: 'Node 3', color: 'lightgreen' },
    { key: 'Node 4', color: 'magenta' }
  ];
  public diagramLinkData: Array<any> = [
    { key: -1, from: 'Node1', to: 'Node 2' },
    { key: -2, from: 'Node1', to: 'Node 3' },
    { key: -3, from: 'Node 2', to: 'Node 2' },
    { key: -4, from: 'Node 3', to: 'Node 4' },
    { key: -5, from: 'Node 4', to: 'Node1' }
  ];
  public diagramDivClassName: string = 'myDiagramDiv';
  public diagramModelData = { prop: 'value' };
  public skipsDiagramUpdate = false;
  
  public diagramModelChange = function(changes: go.IncrementalData) {
    this.skipsDiagramUpdate = true;
  
    this.diagramNodeData = DataSyncService.syncNodeData(changes, this.diagramNodeData);
    this.diagramLinkData = DataSyncService.syncLinkData(changes, this.diagramLinkData);
    this.diagramModelData = DataSyncService.syncModelData(changes, this.diagramModelData);
  };
}
