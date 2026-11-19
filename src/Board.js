import React from 'react';
import Dragula from 'dragula';
import 'dragula/dist/dragula.css';
import Swimlane from './Swimlane';
import './Board.css';

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    const clients = this.getClients();
    
    this.state = {
      clients: {
        // All tasks start in the backlog
        backlog: clients.map(client => ({ ...client, status: 'backlog' })),
        inProgress: [],
        complete: [],
      }
    };

    this.swimlanes = {
      backlog: React.createRef(),
      inProgress: React.createRef(),
      complete: React.createRef(),
    };
  }

  componentDidMount() {
    const containers = [
      this.swimlanes.backlog.current,
      this.swimlanes.inProgress.current,
      this.swimlanes.complete.current,
    ];

    this.drake = Dragula(containers);

    this.drake.on('drop', (el, target, source, sibling) => {
      // CRITICAL FIX: Cancel Dragula's DOM manipulation.
      // This puts the card back temporarily so React can move it cleanly without crashing.
      this.drake.cancel(true);

      const cardId = el.getAttribute('data-id');
      
      // Determine which lane the card was dropped into
      let targetKey = 'backlog';
      let newStatus = 'backlog';
      if (target === this.swimlanes.inProgress.current) {
        targetKey = 'inProgress';
        newStatus = 'in-progress';
      } else if (target === this.swimlanes.complete.current) {
        targetKey = 'complete';
        newStatus = 'complete';
      }

      this.setState(prevState => {
        // Find the original data for the dragged card
        const allClients = Object.values(prevState.clients).flat();
        const draggedCard = allClients.find(c => c.id === cardId);
        if (!draggedCard) return null;

        // Remove the card from all lanes
        const newClients = {
          backlog: prevState.clients.backlog.filter(c => c.id !== cardId),
          inProgress: prevState.clients.inProgress.filter(c => c.id !== cardId),
          complete: prevState.clients.complete.filter(c => c.id !== cardId),
        };

        // Calculate exactly where to insert the card in the new lane
        const targetArray = [...newClients[targetKey]];
        let insertIndex = targetArray.length; // Default to the bottom

        if (sibling) {
          const siblingId = sibling.getAttribute('data-id');
          const siblingIndex = targetArray.findIndex(c => c.id === siblingId);
          if (siblingIndex !== -1) {
            insertIndex = siblingIndex; // Insert right before the sibling card
          }
        }

        // Insert the card with its new status (this triggers the color change)
        targetArray.splice(insertIndex, 0, { ...draggedCard, status: newStatus });
        newClients[targetKey] = targetArray;

        return { clients: newClients };
      });
    });
  }

  componentWillUnmount() {
    if (this.drake) this.drake.destroy();
  }

  getClients() {
    return [
      ['1', 'Stark, White and Abbott', 'Cloned Optimal Architecture', 'in-progress'],
      ['2', 'Wiza LLC', 'Exclusive Bandwidth-Monitored Implementation', 'complete'],
      ['3', 'Nolan LLC', 'Vision-Oriented 4Thgeneration Graphicaluserinterface', 'backlog'],
      ['4', 'Thompson PLC', 'Streamlined Regional Knowledgeuser', 'in-progress'],
      ['5', 'Walker-Williamson', 'Team-Oriented 6Thgeneration Matrix', 'in-progress'],
      ['6', 'Boehm and Sons', 'Automated Systematic Paradigm', 'backlog'],
      ['7', 'Runolfsson, Hegmann and Block', 'Integrated Transitional Strategy', 'backlog'],
      ['8', 'Schumm-Labadie', 'Operative Heuristic Challenge', 'backlog'],
      ['9', 'Kohler Group', 'Re-Contextualized Multi-Tasking Attitude', 'backlog'],
      ['10', 'Romaguera Inc', 'Managed Foreground Toolset', 'backlog'],
      ['11', 'Reilly-King', 'Future-Proofed Interactive Toolset', 'complete'],
      ['12', 'Emard, Champlin and Runolfsdottir', 'Devolved Needs-Based Capability', 'backlog'],
      ['13', 'Fritsch, Cronin and Wolff', 'Open-Source 3Rdgeneration Website', 'complete'],
      ['14', 'Borer LLC', 'Profit-Focused Incremental Orchestration', 'backlog'],
      ['15', 'Emmerich-Ankunding', 'User-Centric Stable Extranet', 'in-progress'],
      ['16', 'Willms-Abbott', 'Progressive Bandwidth-Monitored Access', 'in-progress'],
      ['17', 'Brekke PLC', 'Intuitive User-Facing Customerloyalty', 'complete'],
      ['18', 'Bins, Toy and Klocko', 'Integrated Assymetric Software', 'backlog'],
      ['19', 'Hodkiewicz-Hayes', 'Programmable Systematic Securedline', 'backlog'],
      ['20', 'Murphy, Lang and Ferry', 'Organized Explicit Access', 'backlog'],
    ].map(companyDetails => ({
      id: companyDetails[0],
      name: companyDetails[1],
      description: companyDetails[2],
      status: companyDetails[3],
    }));
  }

  render() {
    return (
      <div className="Board">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4">
              <Swimlane name="Backlog" clients={this.state.clients.backlog} dragulaRef={this.swimlanes.backlog} />
            </div>
            <div className="col-md-4">
              <Swimlane name="In Progress" clients={this.state.clients.inProgress} dragulaRef={this.swimlanes.inProgress} />
            </div>
            <div className="col-md-4">
              <Swimlane name="Complete" clients={this.state.clients.complete} dragulaRef={this.swimlanes.complete} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
