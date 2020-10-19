import React from 'react'

export default function Description({ meta, full }) {
	if (full) {
		return (
			<div>
				{ full ? meta.content : null }
			</div>
		)
	} else {
		return (null)
	}
}
