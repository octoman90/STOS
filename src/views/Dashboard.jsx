import React, { useState } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import Header from '../components/Header.jsx'
import List from '../components/List.jsx'

export default function Dashboard() {
	const [tasks, setTasks] = useState({
		'task0': { id: 'task0', title: 'Task with id 0' },
		'task1': { id: 'task1', title: 'Task with id 1' },
		'task2': { id: 'task2', title: 'Task with id 2' },
		'task3': { id: 'task3', title: 'Task with id 3' },
	})

	const [columns, setColumns] = useState({
		'list0': { id: 'list0', title: 'List with id 0', taskIds: ['task0', 'task1'] },
		'list1': { id: 'list1', title: 'List with id 1', taskIds: ['task2', 'task3'] },
	})

	const [columnOrder, setColumnOrder] = useState(['list0', 'list1'])

	function dragEndHandler(result) {
		const { destination, source, draggableId } = result

		if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
			return
		}

		if (source.droppableId === destination.droppableId) {
			const column = columns[source.droppableId]
			const newTaskIds = Array.from(column.taskIds)
			newTaskIds.splice(source.index, 1)
			newTaskIds.splice(destination.index, 0, draggableId)

			const newColumn = {
				...column,
				taskIds: newTaskIds
			}

			setColumns(prevState => {
				return { ...prevState, [newColumn.id]: newColumn }
			})
		} else {
			const columnA = columns[source.droppableId]
			const columnB = columns[destination.droppableId]
			const newTaskIdsA = Array.from(columnA.taskIds)
			const newTaskIdsB = Array.from(columnB.taskIds)
			newTaskIdsA.splice(source.index, 1)
			newTaskIdsB.splice(destination.index, 0, draggableId)

			const newColumnA = {
				...columnA,
				taskIds: newTaskIdsA
			}

			const newColumnB = {
				...columnB,
				taskIds: newTaskIdsB
			}

			setColumns(prevState => {
				return { ...prevState, [newColumnA.id]: newColumnA, [newColumnB.id]: newColumnB }
			})
		}
	}

	return (
		<div className="layout">
			<Header />
			<div id="dashboard-root">
				<div className="background-layer"></div>
				<DragDropContext onDragEnd={ dragEndHandler }>
					{
						columnOrder.map(columnId => {
							const column = columns[columnId]

							return <List key={ columnId } meta={ column } tasks={ tasks } />
						})
					}
				</DragDropContext>
			</div>
		</div>
	)
}
